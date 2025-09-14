import CodeSnippetImage from '../common/CodeSnippetImage'

const initialCode = `const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
};`;

function CodeGenerator() {

    return (
        <>
            <div className="w-full bg-light-blue">
                <div className="max-w-[1200px] mx-auto px-2 py-12 flex flex-col items-center justify-start gap-2">
                    {/* headings */}
                    <h2 className="text-light-blue-1 font-poppins text-4xl font-bold tracking-wide mt-2 text-center">AI Code Generator</h2>
                    <p className="max-w-[90%] sm:max-w-[65%] text-md text-gray font-poppins text-center">Describe your code idea and let AI create beautiful, shareable snippets with explanations</p>

                    {/* code snippet Generator */}
                    <div className="w-full flex items-stretch gap-8 mt-14">

                        {/* image gen */}
                        <div className='w-full flex justify-center items-center'>
                            <CodeSnippetImage
                                initialCode={initialCode}
                                onChange={() => { }}
                                isDashboard={false}
                                showExplaination={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CodeGenerator