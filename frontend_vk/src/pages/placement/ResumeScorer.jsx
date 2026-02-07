import React, { useState } from 'react';
import { resumeApi } from '../../api/resume.api';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowLeft,
    Sparkles,
    TrendingUp,
    Target,
    Tag,
    Briefcase,
    ChevronDown,
    ChevronUp,
    Zap,
    Award,
    GraduationCap,
    Code,
    Layout,
    FileCheck,
    Lightbulb,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResumeScorer = () => {
    const { isDark } = useTheme();
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [showJobInput, setShowJobInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setResult(null);
            } else {
                toast.error('Please upload a PDF file');
            }
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            toast.error('Please upload a resume first');
            return;
        }

        setLoading(true);
        try {
            const response = await resumeApi.analyze(file, jobDescription);
            if (response.success) {
                setResult(response.data);
                toast.success('Resume analyzed successfully!');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-emerald-500 to-teal-500';
        if (score >= 60) return 'from-amber-500 to-orange-500';
        return 'from-red-500 to-rose-500';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return isDark ? 'bg-emerald-500/20' : 'bg-emerald-50';
        if (score >= 60) return isDark ? 'bg-amber-500/20' : 'bg-amber-50';
        return isDark ? 'bg-red-500/20' : 'bg-red-50';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500/20 text-red-500';
            case 'medium': return 'bg-amber-500/20 text-amber-500';
            case 'low': return 'bg-blue-500/20 text-blue-500';
            default: return 'bg-slate-500/20 text-slate-500';
        }
    };

    const sectionIcons = {
        education: GraduationCap,
        experience: Briefcase,
        skills: Code,
        projects: Lightbulb,
        formatting: Layout
    };

    return (
        <div className={clsx("min-h-screen p-6", isDark ? "bg-slate-900" : "bg-slate-50")}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/placement"
                        className={clsx(
                            "inline-flex items-center gap-2 text-sm font-medium mb-4 transition-colors",
                            isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Placement
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                                AI Resume Analyzer
                            </h1>
                            <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                Get detailed AI-powered feedback with ATS optimization & job matching
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className={clsx(
                    "rounded-2xl border p-6 mb-6",
                    isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                )}>
                    <h2 className={clsx("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
                        Upload Your Resume
                    </h2>

                    {/* Drag & Drop Zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={clsx(
                            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                            dragActive
                                ? "border-violet-500 bg-violet-500/10"
                                : isDark
                                    ? "border-slate-600 hover:border-slate-500"
                                    : "border-slate-300 hover:border-slate-400",
                            file && (isDark ? "bg-slate-700/50" : "bg-slate-50")
                        )}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        {file ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <p className={clsx("font-medium", isDark ? "text-white" : "text-slate-900")}>
                                    {file.name}
                                </p>
                                <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className={clsx(
                                    "p-4 rounded-full",
                                    isDark ? "bg-slate-700" : "bg-slate-100"
                                )}>
                                    <Upload className={clsx("w-8 h-8", isDark ? "text-slate-400" : "text-slate-500")} />
                                </div>
                                <div>
                                    <p className={clsx("font-medium", isDark ? "text-white" : "text-slate-900")}>
                                        Drag & drop your resume
                                    </p>
                                    <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                        or click to browse (PDF only, max 5MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Job Description Toggle */}
                    <div className="mt-4">
                        <button
                            onClick={() => setShowJobInput(!showJobInput)}
                            className={clsx(
                                "flex items-center gap-2 text-sm font-medium transition-colors",
                                isDark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"
                            )}
                        >
                            <Briefcase className="w-4 h-4" />
                            {showJobInput ? 'Hide' : 'Add'} Job Description (Optional)
                            {showJobInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showJobInput && (
                            <div className="mt-3">
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here to get match probability and tailored suggestions..."
                                    rows={4}
                                    className={clsx(
                                        "w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none",
                                        isDark
                                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-violet-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500"
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className={clsx(
                            "w-full mt-6 py-3 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                            !file || loading
                                ? "bg-slate-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Analyze with AI
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-6">
                        {/* Score Overview */}
                        <div className={clsx(
                            "rounded-2xl border p-6",
                            isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                        )}>
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Main Score */}
                                <div className="flex-shrink-0">
                                    <div className={clsx(
                                        "w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br",
                                        getScoreGradient(result.score)
                                    )}>
                                        <div className={clsx(
                                            "w-24 h-24 rounded-full flex flex-col items-center justify-center",
                                            isDark ? "bg-slate-800" : "bg-white"
                                        )}>
                                            <span className={clsx("text-3xl font-bold", getScoreColor(result.score))}>
                                                {result.score}
                                            </span>
                                            <span className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                                Resume Score
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary & ATS Score */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className={clsx("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                                        Resume Analysis Complete
                                    </h3>
                                    <p className={clsx("text-sm mb-4", isDark ? "text-slate-300" : "text-slate-600")}>
                                        {result.summary}
                                    </p>

                                    {result.atsScore !== undefined && (
                                        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                                            <div className={clsx(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-full",
                                                getScoreBg(result.atsScore)
                                            )}>
                                                <FileCheck className={clsx("w-4 h-4", getScoreColor(result.atsScore))} />
                                                <span className={clsx("text-sm font-medium", getScoreColor(result.atsScore))}>
                                                    ATS Score: {result.atsScore}%
                                                </span>
                                            </div>
                                            {result.jobMatch && (
                                                <div className={clsx(
                                                    "flex items-center gap-2 px-3 py-1.5 rounded-full",
                                                    getScoreBg(result.jobMatch.matchScore)
                                                )}>
                                                    <Target className={clsx("w-4 h-4", getScoreColor(result.jobMatch.matchScore))} />
                                                    <span className={clsx("text-sm font-medium", getScoreColor(result.jobMatch.matchScore))}>
                                                        Job Match: {result.jobMatch.matchScore}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Job Match Analysis (if provided) */}
                        {result.jobMatch && (
                            <div className={clsx(
                                "rounded-2xl border p-6",
                                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                            )}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase className="w-5 h-5 text-violet-500" />
                                    <h3 className={clsx("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                        Job Match Analysis
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className={clsx("text-sm font-medium mb-2 text-emerald-500")}>
                                            ✓ Matched Skills ({result.jobMatch.matchedSkills?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.jobMatch.matchedSkills?.map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-500">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={clsx("text-sm font-medium mb-2 text-red-500")}>
                                            ✗ Missing Skills ({result.jobMatch.missingSkills?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.jobMatch.missingSkills?.map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-500">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {result.jobMatch.recommendations && (
                                    <div className="mt-4">
                                        <h4 className={clsx("text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                            Recommendations for this role:
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.jobMatch.recommendations.map((rec, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                    <span className={clsx("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                                                        {rec}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section Analysis */}
                        {result.sectionAnalysis && (
                            <div className={clsx(
                                "rounded-2xl border p-6",
                                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                            )}>
                                <h3 className={clsx("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
                                    Section-by-Section Analysis
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {Object.entries(result.sectionAnalysis).map(([section, data]) => {
                                        const Icon = sectionIcons[section] || FileText;
                                        return (
                                            <button
                                                key={section}
                                                onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                                                className={clsx(
                                                    "p-4 rounded-xl text-center transition-all cursor-pointer border",
                                                    expandedSection === section
                                                        ? "ring-2 ring-violet-500"
                                                        : "",
                                                    isDark
                                                        ? "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                                                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                                                )}
                                            >
                                                <Icon className={clsx("w-5 h-5 mx-auto mb-2", getScoreColor(data.score))} />
                                                <p className={clsx("text-lg font-bold", getScoreColor(data.score))}>
                                                    {data.score}
                                                </p>
                                                <p className={clsx("text-xs capitalize", isDark ? "text-slate-400" : "text-slate-500")}>
                                                    {section}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {expandedSection && result.sectionAnalysis[expandedSection] && (
                                    <div className={clsx(
                                        "mt-4 p-4 rounded-xl",
                                        isDark ? "bg-slate-700/50" : "bg-slate-100"
                                    )}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={clsx("font-medium capitalize", isDark ? "text-white" : "text-slate-900")}>
                                                {expandedSection} Feedback
                                            </h4>
                                            <button onClick={() => setExpandedSection(null)}>
                                                <X className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                                            </button>
                                        </div>
                                        <p className={clsx("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                                            {result.sectionAnalysis[expandedSection].feedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Strengths */}
                        {result.strengths && result.strengths.length > 0 && (
                            <div className={clsx(
                                "rounded-2xl border p-6",
                                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                            )}>
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                    <h3 className={clsx("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                        Key Strengths
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {result.strengths.map((strength, idx) => (
                                        <div key={idx} className={clsx(
                                            "p-4 rounded-xl border-l-4 border-emerald-500",
                                            isDark ? "bg-slate-700/50" : "bg-emerald-50/50"
                                        )}>
                                            <h4 className={clsx("font-semibold mb-1", isDark ? "text-white" : "text-slate-900")}>
                                                {typeof strength === 'object' ? strength.title : strength}
                                            </h4>
                                            {typeof strength === 'object' && (
                                                <>
                                                    <p className={clsx("text-sm mb-2", isDark ? "text-slate-300" : "text-slate-600")}>
                                                        {strength.description}
                                                    </p>
                                                    {strength.impact && (
                                                        <p className="text-xs text-emerald-500 font-medium">
                                                            💡 Impact: {strength.impact}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Areas to Improve */}
                        {result.improvements && result.improvements.length > 0 && (
                            <div className={clsx(
                                "rounded-2xl border p-6",
                                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                            )}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-amber-500" />
                                    <h3 className={clsx("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                        Areas to Improve
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {result.improvements.map((improvement, idx) => (
                                        <div key={idx} className={clsx(
                                            "p-4 rounded-xl border-l-4 border-amber-500",
                                            isDark ? "bg-slate-700/50" : "bg-amber-50/50"
                                        )}>
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                                    {typeof improvement === 'object' ? improvement.title : improvement}
                                                </h4>
                                                {typeof improvement === 'object' && improvement.priority && (
                                                    <span className={clsx("px-2 py-0.5 text-xs font-medium rounded-full uppercase", getPriorityColor(improvement.priority))}>
                                                        {improvement.priority}
                                                    </span>
                                                )}
                                            </div>
                                            {typeof improvement === 'object' && (
                                                <>
                                                    <p className={clsx("text-sm mb-2", isDark ? "text-slate-300" : "text-slate-600")}>
                                                        {improvement.description}
                                                    </p>
                                                    {improvement.suggestion && (
                                                        <div className={clsx("p-3 rounded-lg text-sm", isDark ? "bg-slate-600/50" : "bg-white")}>
                                                            <span className="font-medium text-violet-500">💡 How to fix: </span>
                                                            <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                                                                {improvement.suggestion}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggested Keywords */}
                        {result.suggestedKeywords && result.suggestedKeywords.length > 0 && (
                            <div className={clsx(
                                "rounded-2xl border p-6",
                                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                            )}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag className="w-5 h-5 text-cyan-500" />
                                    <h3 className={clsx("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                        Suggested Keywords to Add
                                    </h3>
                                </div>
                                <p className={clsx("text-sm mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
                                    Add these industry-relevant keywords to improve ATS compatibility:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.suggestedKeywords.map((keyword, idx) => (
                                        <span
                                            key={idx}
                                            className={clsx(
                                                "px-3 py-1.5 text-sm font-medium rounded-full",
                                                isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-700"
                                            )}
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Plan */}
                        {result.actionPlan && result.actionPlan.length > 0 && (
                            <div className={clsx(
                                "rounded-2xl border p-6",
                                isDark ? "bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-violet-700/50" : "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"
                            )}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-5 h-5 text-violet-500" />
                                    <h3 className={clsx("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                        Priority Action Plan
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {result.actionPlan.map((action, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                                                "bg-violet-500 text-white"
                                            )}>
                                                {idx + 1}
                                            </div>
                                            <p className={clsx("text-sm pt-1.5", isDark ? "text-slate-300" : "text-slate-700")}>
                                                {action}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ATS Issues */}
                        {result.atsIssues && result.atsIssues.length > 0 && (
                            <div className={clsx(
                                "rounded-2xl border p-6",
                                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                            )}>
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <h3 className={clsx("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                        ATS Compatibility Issues
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {result.atsIssues.map((issue, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span className={clsx("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                                                {issue}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeScorer;
