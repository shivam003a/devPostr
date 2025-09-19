import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { toPng } from 'html-to-image'
import { Code, Download, Loader } from 'lucide-react'
import { SketchPicker } from 'react-color'
import * as Popover from '@radix-ui/react-popover';
import { js as js_beautify } from 'js-beautify';
import "prismjs/components/prism-clike";
import "prismjs/themes/prism-okaidia.css"
import { prismLanguages, supportedLangauges } from "../../utils/codeSnippetGeneratorThemes.js";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export default function CodeSnippetImage({ post, initialCode, onChange, isDashboard = false, showExplaination = false }) {
    const [code, setCode] = useState(post?.codeSnippet || initialCode);
    const [language, setLanguage] = useState(post?.langauge || "javascript");
    const [color, setColor] = useState(post?.bgColor || { r: '168', g: '181', b: '192', a: '1' })
    const [codeColor, setCodeColor] = useState(post?.codeColor || { r: '39', g: '40', b: '34', a: '1' })
    const [selected, setSelected] = useState(Boolean((post?.status === "scheduled") || post?.status === "posted") || false)
    const [scheduledAt, setScheduledAt] = useState(post?.scheduledAt ? new Date(post?.scheduledAt) : undefined)

    const [downloadLoading, setDownloadLoading] = useState(false)

    const downloadRef = useRef(null)

    const handleDownload = useCallback(() => {
        setDownloadLoading(true)
        if (!downloadRef.current) return;

        toPng(downloadRef?.current, {
            cacheBust: false,
            pixelRatio: 4
        })
            .then((dataURL) => {
                const link = document.createElement("a");
                link.download = "code-snippet.png";
                link.href = dataURL;
                link.click();
            })
            .catch((err) => {
                console.error("Image export failed", err);
            });
        setDownloadLoading(false)
    }, []);

    useEffect(() => {
        prismLanguages[language] ? prismLanguages[language]() : prismLanguages["javascript"]()
    }, [language])

    useEffect(() => {
        onChange({
            codeColor,
            color,
            scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : "",
            selected
        })
    }, [selected, codeColor, color, scheduledAt])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">

            {/* toolbar */}
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center justify-center gap-2">
                    {/* checkbox */}
                    {isDashboard &&
                        <div
                            className="flex items-center justify-center gap-2 border border-light-blue-1 p-1"
                            style={post?.status === 'posted' || post?.status === 'scheduled' ? { opacity: "50%" } : {}}
                        >
                            <input
                                type="checkbox"
                                name="postSelector"
                                className="custom-checkbox disabled:opacity-50"
                                value={selected}
                                checked={selected}
                                onChange={(e) => setSelected(e?.target?.checked)}
                                disabled={post?.status === 'posted' || post?.status === 'scheduled'}
                            />
                        </div>
                    }

                    {/* datetimepicker */}
                    {isDashboard &&
                        <div className="h-7 flex items-center justify-center gap-2 border border-light-blue-1 p-1 disabled:opacity-0"
                            style={post?.status === 'posted' || post?.status === 'scheduled' || !selected ? { opacity: '0.6' } : {}}
                        >
                            <DatePicker
                                selected={scheduledAt}
                                onChange={(date) => setScheduledAt(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={10}
                                dateFormat="yyyy-MM-dd HH:mm"
                                placeholderText="Select Time"
                                disabled={post?.status === 'posted' || post?.status === 'scheduled' || !selected}
                                className="text-sm text-light-blue-1 font-light !border-0 !outline-0 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                            />
                        </div>
                    }

                    {/* languages selector */}
                    {
                        !isDashboard &&
                        <div className="flex items-center justify-center gap-2 border border-light-blue-1 p-1">
                            <Code size={14} color="#3c83f6" strokeWidth={1} />
                            <select
                                className="text-sm text-light-blue-1 font-light !border-0 !outline-0 cursor-pointer"
                                value={language}
                                onChange={(e) => setLanguage(e?.target?.value)}
                                disabled={isDashboard}
                            >
                                {
                                    supportedLangauges && supportedLangauges?.map((lang, index) => (
                                        <option value={lang?.value} key={index}>{lang?.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    }
                </div>

                <div className="flex items-center justify-center gap-2">

                    {/* color selector */}
                    <Popover.Root>
                        <Popover.Trigger
                            className="w-7 h-7 border border-light-blue-1 cursor-pointer"
                            style={{ backgroundColor: `rgba(${color.r}, ${color.g},${color.b},${color.a})` }}
                        />
                        <Popover.Content
                            avoidCollisions={true}
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            align="start"
                            side="left"
                            sideOffset={4}
                        >
                            <SketchPicker color={color} onChange={(e) => setColor(e?.rgb)} />
                        </Popover.Content>
                    </Popover.Root>

                    {/* code color selector */}
                    <Popover.Root>
                        <Popover.Trigger
                            className="w-7 h-7 border border-light-blue-1 cursor-pointer"
                            style={{ backgroundColor: `rgba(${codeColor.r}, ${codeColor.g},${codeColor.b},${codeColor.a})` }}
                        />
                        <Popover.Content
                            avoidCollisions={true}
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            align="start"
                            side="left"
                            sideOffset={4}
                        >
                            <SketchPicker color={codeColor} onChange={(e) => setCodeColor(e?.rgb)} />
                        </Popover.Content>
                    </Popover.Root>

                    {/* export btn */}
                    <button
                        className="w-7 h-7 flex items-center justify-center gap-2 border border-light-blue-1 p-1 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={handleDownload}
                        disabled={downloadLoading}
                    >
                        {downloadLoading ?
                            <Loader
                                color="#3c83f6"
                                size={15}
                                strokeWidth={1}
                                className="animate-spin"
                            /> :
                            <Download
                                color="#3c83f6"
                                size={15}
                                strokeWidth={1}
                            />}

                    </button>
                </div>
            </div>

            {/* image */}
            <div className="w-full h-full flex flex-col items-start justify-center rounded-lg gap-2">

                {/* code renderer */}
                <div
                    className="flex justify-center items-center w-full h-full py-16 px-2 sm:px-20 overflow-hidden to-downloadx"
                    style={{ backgroundColor: `rgba(${color.r}, ${color.g},${color.b},${color.a})` }}
                    ref={downloadRef}
                >
                    <div
                        className="mx-auto rounded-lg p-3"
                        style={{ backgroundColor: `rgba(${codeColor.r}, ${codeColor.g},${codeColor.b},${codeColor.a})` }}
                    >

                        {/* macOS traffic lights */}
                        <div className="flex gap-2 justify-between items-center mb-2">
                            <div className="flex gap-2 items-center">
                                <div className="w-[14px] h-[14px] rounded-full bg-cs-red"></div>
                                <div className="w-[14px] h-[14px] rounded-full bg-cs-yellow"></div>
                                <div className="w-[14px] h-[14px] rounded-full bg-cs-green"></div>
                            </div>
                            <span className="font-poopins text-gray text-[10px] font-semibold">{language.toUpperCase()}</span>
                        </div>

                        {/* code editor */}
                        <div className="no-border">
                            <Editor
                                value={js_beautify(code, { indent_size: 4 })}
                                onValueChange={setCode}
                                highlight={(code) =>
                                    Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)
                                }
                                padding={2}
                                style={{
                                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                                    fontSize: 14,
                                    color: "white",
                                    backgroundColor: 'transparent',
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                }}
                                disabled={isDashboard}
                            />
                        </div>
                    </div>
                </div>

                {/* explaination generator */}
                {showExplaination &&
                    <div
                        className={`flex justify-center items-center h-full py-16 px-2 sm:px-20 overflow-hidden to-downloadx`}
                        style={{ backgroundColor: `rgba(${color.r},${color.g},${color.b},${color.a})` }}
                    // ref={downloadRef}
                    >
                        <div
                            className="mx-auto rounded-lg p-3"
                            style={{ backgroundColor: `rgba(${codeColor.r}, ${codeColor.g},${codeColor.b},${codeColor.a})` }}
                        >
                            {/* macOS traffic lights */}
                            <div className="flex gap-2 justify-between items-center mb-2">
                                <div className="flex gap-2 items-center">
                                    <div className="w-[14px] h-[14px] rounded-full bg-cs-red"></div>
                                    <div className="w-[14px] h-[14px] rounded-full bg-cs-yellow"></div>
                                    <div className="w-[14px] h-[14px] rounded-full bg-cs-green"></div>
                                </div>
                                <span className="font-poopins text-gray text-[10px] font-semibold">{language.toUpperCase()}</span>
                            </div>

                            {/* code editor */}
                            <div className="no-border flex flex-col gap-4">
                                <div className="flex flex-col gap-[2px]">
                                    <span className="text-white font-fira text-[13px]">Correct Answer</span>
                                    <span className="text-gray font-fira text-[13px]">&gt; {post?.correctAns}</span>
                                </div>
                                <div className="flex flex-col gap-[2px]">
                                    <span className="text-white font-fira text-[13px]">Explaination</span>
                                    <span className="text-gray font-fira text-[13px]">&gt; {post?.explaination}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
