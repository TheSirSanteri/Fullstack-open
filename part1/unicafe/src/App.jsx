import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return(
  <button onClick={handleClick}>{text}</button>
)};

const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statics = ({good, neutral, bad}) => {
  const all = (good + neutral + bad);

  const countAverage = () => {
    if (all === 0) return 0;
    return (good - bad) / all;
  };

  const countPercentage = () => {
    if (all === 0) return 0;
    return `${good / all * 100} %`;
  }
  return (
    <>
      <h1>statics</h1>
      {all === 0 ? (
        <p>No given feedback</p>
      ) : (
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={countAverage()}/>
          <StatisticLine text="positive" value={countPercentage()}/>
        </tbody>
      </table>
      )}
    </>
  );
};



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1);
  const incrementNeutral = () => setNeutral(neutral + 1);
  const incrementBad = () => setBad(bad + 1);

  return (
    <>
    <h1>give feedback</h1>
      <div>
        <Button handleClick={incrementGood} text="good" />
        <Button handleClick={incrementNeutral} text="neutral" />
        <Button handleClick={incrementBad} text="bad" />
      </div>

      <Statics good={good} neutral={neutral} bad={bad} />
    </>

  )
}

export default App
