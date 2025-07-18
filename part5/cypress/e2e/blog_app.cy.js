describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpass'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('testpass')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('wrongpass')
      cy.get('button[type="submit"]').click()

      cy.contains('invalid username or password').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // login via backend and set localStorage
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testuser',
        password: 'testpass'
      }).then(({ body }) => {
        localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
        cy.visit('http://localhost:5173')
      })
    })

    it('A blog can be created', function() {
      cy.contains('Add new blog').click()
      cy.get('input').eq(0).type('A new test blog')
      cy.get('input').eq(1).type('Cypress Tester')
      cy.get('input').eq(2).type('http://example.com')
      cy.get('form button[type="submit"]').click()

      cy.contains('a new blog A new test blog by Cypress Tester added')
    })

    it('A blog can be liked', function() {
      
      cy.contains('Add new blog').click()
      cy.get('input').eq(0).type('Likable blog')
      cy.get('input').eq(1).type('Like Tester')
      cy.get('input').eq(2).type('http://example.com/like')
      cy.get('form button[type="submit"]').click()

      
      cy.contains('Likable blog Like Tester')
        .parent()
        .contains('view')
        .click()

      
      cy.contains('likes 0')
      cy.get('button').contains('like').click()
      cy.contains('likes 1')
    })

    it('User can delete their own blog', function() {

      cy.contains('Add new blog').click()
      cy.get('input').eq(0).type('Deletable blog')
      cy.get('input').eq(1).type('Delete Tester')
      cy.get('input').eq(2).type('http://example.com/delete')
      cy.get('form button[type="submit"]').click()

      cy.contains('Deletable blog Delete Tester')
        .parent()
        .contains('view')
        .click()

      cy.get('button').contains('delete').click()

      cy.contains('Deletable blog Delete Tester').should('not.exist')
    })

    it('Blogs are ordered by likes in descending order', function() {
      const blogs = [
        { title: 'Least liked', author: 'Author 1', url: 'http://a.com' },
        { title: 'Medium liked', author: 'Author 2', url: 'http://b.com' },
        { title: 'Most liked', author: 'Author 3', url: 'http://c.com' }
      ]

      blogs.forEach(blog => {
        cy.contains('Add new blog').click()
        cy.get('input').eq(0).type(blog.title)
        cy.get('input').eq(1).type(blog.author)
        cy.get('input').eq(2).type(blog.url)
        cy.get('form button[type="submit"]').click()
      })

      cy.wait(300) // Wait for blogs to be added

      cy.get('.blog').each($el => {
        cy.wrap($el).within(() => {
          cy.get('button').contains('view').click()
        })
      })

      const likeBlog = (title, times) => {
        cy.get('.blog').contains(title).parents('.blog').within(() => {
          for (let i = 0; i < times; i++) {
            cy.get('button').contains('like').click()
            cy.contains(`likes ${i + 1}`)
          }
        })
      }

      likeBlog('Most liked', 3)
      likeBlog('Medium liked', 2)
      likeBlog('Least liked', 1)

      // Odotetaan hetki, että päivitykset ehtivät tapahtua
      cy.wait(1000)

      cy.get('.blog').eq(0).should('contain', 'Most liked')
      cy.get('.blog').eq(1).should('contain', 'Medium liked')
      cy.get('.blog').eq(2).should('contain', 'Least liked')
    })    
  })

  describe('multiple users', function() {
    beforeEach(function() {
      // Reset the database and create two users
      cy.request('POST', 'http://localhost:3003/api/testing/reset')

      const userA = {
        name: 'User A',
        username: 'usera',
        password: 'passa'
      }

      const userB = {
        name: 'User B',
        username: 'userb',
        password: 'passb'
      }

      cy.request('POST', 'http://localhost:3003/api/users', userA)
      cy.request('POST', 'http://localhost:3003/api/users', userB)
    })

    describe('when a blog is created by another user', function() {
      beforeEach(function() {
        // Kirjaudu käyttäjänä A ja luo blogi
        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'usera',
          password: 'passa'
        }).then(({ body }) => {
          localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
          cy.visit('http://localhost:5173')

          cy.contains('Add new blog').click()
          cy.get('input').eq(0).type('User A Blog')
          cy.get('input').eq(1).type('Author A')
          cy.get('input').eq(2).type('http://example.com/a')
          cy.get('form button[type="submit"]').click()
          cy.contains('logout').click()
        })
      })

      it('Only the user who created a blog sees the delete button', function() {
        // Kirjaudu käyttäjänä B ja varmista ettei näy delete-nappia
        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'userb',
          password: 'passb'
        }).then(({ body }) => {
          localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
          cy.visit('http://localhost:5173')

          cy.contains('User A Blog Author A')
            .parent()
            .contains('view')
            .click()

          cy.contains('delete').should('not.exist')
        })
      })
    })
  })
})

