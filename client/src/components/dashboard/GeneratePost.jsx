import { SquareTerminal, ListOrdered, Code, Loader } from 'lucide-react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePosts, getBatches } from '../../redux/slices/dashboard.slice.js'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generatePostsSchema } from '../../utils/zodSchema.js';

function GeneratePost() {
    const [postsInfo, setPostsInfo] = useState({
        prompt: '',
        langauge: '',
        noOfPosts: ''
    })
    const [errors, setErrors] = useState({})

    const { loading } = useSelector((state) => state.dashboard)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        let { name, value } = e?.target;

        if (name === 'noOfPosts') {
            value = Math.floor(Number(value) || 0).toString()
        }
        setPostsInfo((prev) => ({
            ...prev,
            [name]: value
        }))

    }

    const handleGeneratePosts = async (e) => {
        e?.preventDefault();

        const parsed = generatePostsSchema.safeParse(postsInfo);
        if (!parsed.success) {
            const fieldErrors = {}
            parsed.error.issues?.map((err) => {
                fieldErrors[err.path[0]] = err?.message
            })
            setErrors(fieldErrors)
            return;
        }

        setErrors({})
        const toastId = toast.loading("Generating...")
        const resultAction = await dispatch(generatePosts(postsInfo))

        if (generatePosts.fulfilled.match(resultAction)) {
            dispatch(getBatches())
            navigate(`/dashboard/${resultAction?.payload?._id}`)
            toast.dismiss(toastId)
            toast.success("Post Generated!")
        }
        else if (generatePosts.rejected.match(resultAction)) {
            toast.dismiss(toastId)
            toast.error(resultAction?.payload)
        }
    }

    return (
        <>
            <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-full sm:w-128 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg p-4 m-2">

                    {/* headers */}
                    <h2 className="text-xl font-poppins text-white font-semibold mb-1">AI-Powered Post Generator</h2>
                    <h3 className="text-sm font-poppins text-gray font-light">Just enter a prompt, choose the number of questions, and pick a language.</h3>

                    {/* inputs */}
                    <div className="mt-12 flex flex-col gap-2">
                        <div className="w-full flex flex-col gap-[6px]">
                            <div className="flex items-center gap-2 bg-gray w-full px-2 py-1 rounded-md">
                                <SquareTerminal size={16} />
                                <input
                                    type="text"
                                    placeholder="Write your prompt here..."
                                    className="text-md p-1 w-full auth-input !outline-0 !border-0"
                                    name="prompt"
                                    autoComplete="off"
                                    value={postsInfo?.prompt}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {errors.prompt && <p className="text-red-500 text-[10px] -mt-1">{errors.prompt}</p>}
                        </div>

                        <div className='flex flex-col sm:flex-row gap-2 items-start justify-center'>
                            <div className="w-full sm:w-1/2 flex flex-col gap-[6px]">
                                <div className="w-full flex items-center gap-2 bg-gray px-2 py-1 rounded-md">
                                    <Code size={16} />
                                    <select
                                        className='text-md p-1 w-full auth-input !outline-0 !border-0'
                                        name="langauge"
                                        value={postsInfo?.langauge}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" defaultChecked>Select programming language</option>
                                        <option value="javascript">JavaScript</option>
                                        <option value="typescript">TypeScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="c">C</option>
                                        <option value="php">PHP</option>
                                    </select>
                                </div>
                                {errors.langauge && <p className="text-red-500 text-[10px] -mt-1">{errors.langauge}</p>}
                            </div>

                            <div className="w-full sm:w-1/2 flex flex-col gap-[6px]">
                                <div className="w-full flex items-center gap-2 bg-gray px-2 py-1 rounded-md">
                                    <ListOrdered size={16} />
                                    <input
                                        type="number"
                                        placeholder="How many questions?"
                                        className="text-md p-1 w-full auth-input !outline-0 !border-0"
                                        name="noOfPosts"
                                        step={1}
                                        value={postsInfo?.noOfPosts}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {errors.noOfPosts && <p className="text-red-500 text-[10px] -mt-1">{errors.noOfPosts}</p>}
                            </div>
                        </div>

                        <button
                            className="w-full h-[32px] rounded-md mt-4 text-md font-semibold p-1 bg-gradient-to-tl from-light-blue-1 to-light-blue-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={handleGeneratePosts}
                            disabled={loading}
                        >
                            {loading ? (<Loader size={22} strokeWidth={1} className="animate-spin mx-auto" />) : ("Generate")}
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 text-center mt-6">⚡ Powered by Artificial Intelligence</p>
                </div>

                {/* blue circle */}
                <div className="absolute w-32 h-32 rounded-full bg-light-blue-1 backdrop-blur-xl opacity-5 shadow-[0px_0px_60px_120px_#3c83f6] top-1/3 left-2/3 random-animate"></div>
                <div className="absolute w-32 h-32 rounded-full bg-light-blue-1 backdrop-blur-xl opacity-5 shadow-[0px_0px_60px_120px_#3c83f6] top-[7%] left-[17%] random-animate-1"></div>
            </div>
        </>
    )
}

export default GeneratePost;