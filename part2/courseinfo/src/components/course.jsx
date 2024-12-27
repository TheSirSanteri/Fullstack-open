
const Course = ({ course }) => {
    console.log("Course:", course)
    return (
      <div>
          <Header  course={course.name}/>
          <Content parts={course.parts}/>
          <Total parts={course.parts}/>
      </div>
    );
};

const Content = ({ parts }) => {
    console.log("parts:", parts )
    return (
        <div>
          {parts.map(part => (
            <Part key={part.id} name={part.name} exercises={part.exercises} />
          ))}
        </div>
      );
};

const Part = ({ name, exercises} ) => {
  return (
    <div>
      <p>{name} {exercises}</p>
    </div>
  );
};


const Header = ({ course }) => {
    return <h1>{course}</h1>
}

const Total = ({ parts }) => {
  const totalCount = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
      <div>
        <p>Total of {totalCount} exercises</p>
      </div>
    );
};

export default Course


