import { useEffect, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
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
    const [scheduleLoading, setScheduleLoading] = useState(false)

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
        const toastId = toast.loading("Schdeuling Posts...")
        setScheduleLoading(true)

        try {
            const response = await api.post('/api/schedule', { posts });
            toast.dismiss(toastId);
            toast.success(response?.data?.message)

        } catch (e) {
            toast.dismiss(toastId)
            toast.error(e?.response?.data?.message || "Something Went Wrong")
        } finally {
            setScheduleLoading(false)
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
                    <div className="w-full h-full max-w-[996px] grid grid-cols-1 lg:grid-cols-2 p-2 items-stretch gap-4 relative mb-4">
                        {
                            batchesPosts && batchesPosts?.length > 0 ? (
                                batchesPosts.map((post, index) => {
                                    const hashtags = post?.hashtags?.split(',').map((tag) => `#${tag}`).join(' ')
                                    const caption = post?.caption + "\n\n" + hashtags;

                                    return (
                                        <div className="relative flex flex-col w-full p-2 gap-2 bg-dark-blue" key={post?._id}>
                                            <div className="relative h-full w-full">
                                                <span className="absolute right-0 bottom-0 bg-dark-blue p-2 text-white text-xs font-poppins">{post?.status || "not_scheduled"}</span>
                                                <CodeSnippetImage
                                                    post={post}
                                                    langauge={post?.langauge}
                                                    correctAns={post?.correctAns}
                                                    explaination={post?.explaination}
                                                    isDashboard={true}
                                                    onChange={(e) => handleSelectedPost(e, index)}
                                                />
                                            </div>
                                            <div className="font-poppins text-[13px] font-light text-white whitespace-pre-line">{caption}</div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="w-full h-full col-span-full flex items-center justify-center">
                                    <span className="text-gray-400 text-md font-poppins text-center">No posts found</span>
                                </div>
                            )
                        }
                    </div>
                )}

                {showScheduleBtn &&
                    <button
                        className="fixed right-5 bottom-5 p-1 w-24 h-8 bg-gradient-to-tr from-light-blue-1 to-light-blue-2 text-black text-md rounded-lg flex items-center justify-center gap-4 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={schedulePosts}
                        disabled={scheduleLoading}
                    >
                        {scheduleLoading ? (<Loader size={18} color="#000" className="animate-spin" />) : "Schedule"}
                    </button>
                }
            </div>
        </>
    )
}

export default PostsInterface;