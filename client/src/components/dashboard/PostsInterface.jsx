import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getBatchesPosts } from "../../redux/slices/dashboard.slice";
import CodeSnippetImage from "../common/CodeSnippetImage";
import { Loader } from "lucide-react";
import toast from 'react-hot-toast'
import api from "../../lib/axiosInstance";

function PostsInterface() {
    const { loading, batchesPosts } = useSelector(state => state.dashboard)
    const [posts, setPosts] = useState([])
    const [showScheduleBtn, setShowScheduleBtn] = useState(false)

    const dispatch = useDispatch();
    const location = useLocation();

    const selectedBatch = location?.pathname?.split('/')[2];

    const handleSelectedPost = (e, index) => {
        const updatedPost = [...posts];
        updatedPost[index] = {
            ...updatedPost[index],
            scheduledAt: e?.scheduledAt,
            selected: e?.selected,
            bgColor: e?.color,
            codeColor: e?.codeColor
        }
        setPosts(updatedPost)
    }

    const schedulePosts = async () => {
        try {
            const response = await api.post('/api/schedule', { posts });
            toast.success(response?.data?.message)

        } catch (e) {
            toast.error(e?.response?.data?.message || "Something Went Wrong")
        }
    }

    useEffect(() => {
        dispatch(getBatchesPosts(selectedBatch))

    }, [dispatch, selectedBatch])

    useEffect(() => {
        if (!loading) {
            setPosts(batchesPosts)
        }
    }, [batchesPosts, selectedBatch])

    useEffect(() => {
        const hasSelectedAndScheduledAt = posts?.some((post) => post?.selected && post.scheduledAt)
        if (hasSelectedAndScheduledAt) {
            setShowScheduleBtn(true)
        }
        else {
            setShowScheduleBtn(false)
        }
    }, [posts, selectedBatch])

    return (
        <>
            <div className="h-full overflow-auto flex flex-wrap items-center justify-center relative">
                {loading ? (
                    <Loader size={22} strokeWidth={1} color="#fff" className="animate-spin" />
                ) : (
                    <div className={`w-full h-full max-w-[996px] grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 items-stretch`}>
                        {
                            batchesPosts && batchesPosts?.length > 0 ? (
                                batchesPosts.map((post, index) => (
                                    <CodeSnippetImage
                                        post={post}
                                        langauge={post?.langauge}
                                        correctAns={post?.correctAns}
                                        explaination={post?.explaination}
                                        key={post?._id}
                                        isDashboard={true}
                                        onChange={(e) => handleSelectedPost(e, index)}
                                    />
                                ))
                            ) : (<span className="w-full text-gray-400 text-md font-poppins text-center">No posts found</span>)
                        }
                    </div>
                )}

                {showScheduleBtn &&
                    <button
                        className="fixed right-5 bottom-5 py-2 px-6 bg-gradient-to-tr from-light-blue-1 to-light-blue-2 text-black text-lg rounded-lg flex items-center gap-4 cursor-pointer shadow-[0px_0px_30px_5px_rgba(59,130,246,0.5)]"
                        onClick={schedulePosts}
                    >
                        Schedule
                    </button>
                }
            </div>
        </>
    )
}

export default PostsInterface;