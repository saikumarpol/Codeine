export default function Problem({ problem }) {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
      <p className="mb-4">{problem.description}</p>
      <h3 className="text-lg font-semibold mb-2">Example Test Cases:</h3>
      <div className="space-y-2">
        {problem.testCases.map((t, i) => (
          <div key={i} className="bg-gray-800 p-2 rounded">
            <p><span className="font-bold">Input:</span> {t.input}</p>
            <p><span className="font-bold">Output:</span> {t.output}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
