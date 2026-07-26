import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, VideoOff, Loader2, Check, ChevronRight, Mic, MicOff, Volume2, Code, Bot, AlertTriangle, ShieldAlert, Eye, Activity } from 'lucide-react';
import { submitInterviewAnswer, startCheatingSession, generateCheatingReport, getCheatingStatus, logClientAlert, getInterviewDetails, initProctoring } from '../services/api';
import aiRecruiterImg from '../../Ai recuriter.png';

const InterviewSession = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: interviewId } = useParams();

    const [interview, setInterview] = useState(location.state?.interview || null);
    const [isLoadingInterview, setIsLoadingInterview] = useState(!interview);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [activeRightPanel, setActiveRightPanel] = useState('chat'); // 'chat' or 'editor'
    const [userAnswer, setUserAnswer] = useState('');
    const [codeAnswer, setCodeAnswer] = useState('// Write your code here...\n');
    const [language, setLanguage] = useState('javascript');
    const [codeOutput, setCodeOutput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    // Proctoring & Emotion HUD states
    const [detectedEmotion, setDetectedEmotion] = useState('Neutral');
    const [focusLevel, setFocusLevel] = useState(98);
    const [gazeState, setGazeState] = useState('Center');
    const [cheatingAlert, setCheatingAlert] = useState(null);
    const [cheatingAlertsCount, setCheatingAlertsCount] = useState(0);
    
    // Initialization screen states
    const [isProctoringInitialized, setIsProctoringInitialized] = useState(false);
    const [hasStartedInterview, setHasStartedInterview] = useState(false);
    
    const videoRef = useRef(null);
    const clientViolationsRef = useRef(0);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // Voice states
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const recognitionRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [modalConfig, setModalConfig] = useState(null);

    // Auto-scroll to bottom of chat container only
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [conversationHistory, currentQuestionIndex, userAnswer, activeRightPanel]);

    // Load interview session on mount or if missing from route parameters
    useEffect(() => {
        const loadInterview = async () => {
            if (interview) {
                setIsLoadingInterview(false);
                return;
            }
            if (!interviewId) {
                navigate('/interview');
                return;
            }
            try {
                const response = await getInterviewDetails(interviewId);
                if (response && response.success && response.interview) {
                    setInterview(response.interview);
                } else {
                    setError("Failed to fetch interview details.");
                }
            } catch (err) {
                console.error("Error fetching interview:", err);
                setError("Error loading interview session. Please try again.");
            } finally {
                setIsLoadingInterview(false);
            }
        };

        loadInterview();
    }, [interviewId, interview, navigate]);

    // Initialize ONLY the backend microservice once interview loads
    useEffect(() => {
        if (!interview) return;

        initProctoring()
            .then(() => {
                setIsProctoringInitialized(true);
            })
            .catch(err => {
                console.error("Proctoring init error:", err);
                setIsProctoringInitialized(true); // Fallback to let user proceed anyway
            });

        return () => {
            stopSpeechSynthesis();
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [interview]);

    const handleStartInterview = () => {
        setHasStartedInterview(true);
        initSpeechRecognition();
        
        // Now actually start the camera and cheating session
        startCheatingSession(interview._id)
            .then(() => {
                setIsCameraActive(true);
            })
            .catch(err => {
                console.error("Cheating session start error:", err);
                setIsCameraActive(true); // Fallback so video images load
            });
    };

    useEffect(() => {
        // Read out the question when it changes
        if (hasStartedInterview && interview && interview.questions && interview.questions[currentQuestionIndex]) {
            speakQuestion(interview.questions[currentQuestionIndex]);
        }
    }, [currentQuestionIndex, interview, hasStartedInterview]);

    // Connect live AI proctoring telemetry feeds to HUD
    useEffect(() => {
        if (!isCameraActive || !interview?._id) return;

        const interval = setInterval(async () => {
            try {
                const status = await getCheatingStatus(interview._id);
                if (status) {
                    if (status.current_emotion) setDetectedEmotion(status.current_emotion);
                    if (status.gaze_state && status.gaze_state.gaze_direction) {
                        setGazeState(status.gaze_state.gaze_direction);
                    }
                    if (status.focus_level !== undefined) setFocusLevel(status.focus_level);
                    
                    if (status.alerts && status.alerts.length > 0) {
                        setCheatingAlertsCount(status.alerts.length);
                        // Trigger HUD alert overlay with the latest warning message
                        const latestAlert = status.alerts[status.alerts.length - 1];
                        setCheatingAlert(latestAlert.message);
                        
                        // Auto-dismiss after 3 seconds
                        setTimeout(() => {
                            setCheatingAlert(null);
                        }, 3000);
                    }

                    // Auto-disqualification / termination handler
                    if (status.disqualified || status.status === "terminated") {
                        clearInterval(interval);
                        stopSpeechSynthesis();
                        if (recognitionRef.current) recognitionRef.current.stop();

                        // Force instant final report generation
                        await generateCheatingReport(interview._id).catch(err => console.error(err));

                        setModalConfig({
                            type: 'alert',
                            title: 'Interview Terminated',
                            message: 'The interview has been terminated due to 8 consecutive AI proctoring violations. You are being redirected to your evaluation results.',
                            onConfirm: () => navigate(`/interview/${interview._id}/feedback`)
                        });
                    }
                }
            } catch (err) {
                console.error("Proctoring sync error:", err);
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [isCameraActive, interview, navigate]);

    // Client-side proctoring: Tab and window focus monitoring
    useEffect(() => {
        if (!interview?._id || !hasStartedInterview) return;

        const handleDisqualification = async (violationType, message) => {
            stopSpeechSynthesis();
            if (recognitionRef.current) recognitionRef.current.stop();

            try {
                // Log the final client alert beacon
                await logClientAlert(interview._id, violationType, message, 1.0).catch(err => console.error(err));
                // Generate report synchronously/force exit
                await generateCheatingReport(interview._id).catch(err => console.error(err));
            } catch (err) {
                console.error("Disqualification sync error:", err);
            }

            setModalConfig({
                type: 'alert',
                title: 'Security Violation Detected',
                message: `The interview has been terminated immediately due to a security violation (${violationType}). You are being redirected to your evaluation results.`,
                onConfirm: () => navigate(`/interview/${interview._id}/feedback`)
            });
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                clientViolationsRef.current += 1;
                const currentStrikes = clientViolationsRef.current;
                if (currentStrikes >= 3) {
                    handleDisqualification("Tab Switch", "Security Violation: Candidate switched tabs or minimized the browser.");
                } else {
                    // Log the alert to the backend so the report shows it
                    logClientAlert(interview._id, "Tab Switch Warning", `Candidate switched tabs (Strike ${currentStrikes})`, 0.5).catch(err => console.error(err));
                    setModalConfig({
                        type: 'alert',
                        title: 'Tab Switch Warning',
                        message: `You have switched tabs or minimized the browser window. This is strike ${currentStrikes} of 2. A third violation will result in immediate disqualification and termination of your interview.`,
                        onConfirm: () => setModalConfig(null)
                    });
                }
            }
        };

        const handleWindowBlur = () => {
            // Delay slightly to prevent focus/blur race conditions on native alerts
            setTimeout(() => {
                if (document.activeElement && (document.activeElement.tagName === 'IFRAME' || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                    // Ignore blur if it went to a valid input/iframe within the document
                    return;
                }
                
                // Do not trigger blur if the window is hidden (that's handled by visibilitychange)
                if (document.hidden) {
                    return;
                }
                
                clientViolationsRef.current += 1;
                const currentStrikes = clientViolationsRef.current;
                if (currentStrikes >= 3) {
                    handleDisqualification("Window Blur", "Security Violation: Candidate clicked outside the interview window.");
                } else {
                    // Log the alert to the backend so the report shows it
                    logClientAlert(interview._id, "Window Blur Warning", `Candidate clicked outside the interview window (Strike ${currentStrikes})`, 0.5).catch(err => console.error(err));
                    setModalConfig({
                        type: 'alert',
                        title: 'Window Focus Warning',
                        message: `You clicked outside the interview window. This is strike ${currentStrikes} of 2. A third violation will result in immediate disqualification and termination of your interview.`,
                        onConfirm: () => setModalConfig(null)
                    });
                }
            }, 200);
        };

        const handleBeforeUnload = () => {
            const url = `http://localhost:5000/api/interview/cheating/generate-report`;
            const token = localStorage.getItem('token');
            const data = JSON.stringify({ interviewId: interview._id });
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: data,
                keepalive: true
            }).catch(err => console.error("Beacon error:", err));
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [interview, navigate]);

    const initSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechSupported(false);
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                }
            }
            if (finalTranscript) {
                setUserAnswer(prev => prev + finalTranscript);
            }
        };

        recognition.onspeechstart = () => {
            setIsUserSpeaking(true);
        };

        recognition.onspeechend = () => {
            setIsUserSpeaking(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            setIsUserSpeaking(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setIsUserSpeaking(false);
        };

        recognitionRef.current = recognition;
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            setIsUserSpeaking(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakQuestion = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            setIsAiSpeaking(false);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95; // Slightly slower for clarity
            utterance.pitch = 1;

            utterance.onstart = () => setIsAiSpeaking(true);
            utterance.onend = () => setIsAiSpeaking(false);
            utterance.onerror = () => setIsAiSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeechSynthesis = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsAiSpeaking(false);
    };

    if (isLoadingInterview) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-purple-500" size={48} />
                <p className="text-slate-400 font-mono text-sm tracking-wider animate-pulse">SECURING INTERVIEW ENVIRONMENT...</p>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 p-4 text-center">
                <AlertTriangle className="text-red-500 animate-bounce" size={48} />
                <p className="text-white font-bold text-lg">Interview Session Not Found</p>
                <p className="text-slate-400 text-sm max-w-md">{error || "Could not retrieve the interview environment."}</p>
                <button 
                    onClick={() => navigate('/interview')}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white font-bold px-6 py-3 rounded-xl transition-all duration-300"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }



    const questions = interview.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleSubmitAnswer = async () => {
        if (!userAnswer.trim() && codeAnswer.trim() === '// Write your code here...') {
            setError("Please provide an answer before continuing.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        stopSpeechSynthesis();

        const combinedAnswer = userAnswer + '\n\nCode Provided (' + language + '):\n' + codeAnswer;

        try {
            await submitInterviewAnswer(interview._id, currentQuestion, combinedAnswer, interview.jobRole);

            // Record into local history for rendering
            setConversationHistory(prev => [...prev, {
                question: currentQuestion,
                answer: userAnswer.trim() ? userAnswer : (codeAnswer.trim() !== '// Write your code here...' ? '[Code snippet submitted]' : '')
            }]);

            setUserAnswer('');
            setCodeAnswer('// Write your code here...\n');
            
            if (isLastQuestion) {
                stopCamera();
                if (recognitionRef.current) recognitionRef.current.stop();
                
                // End interview and generate cheating report
                await generateCheatingReport(interview._id).catch(err => console.error("Report generation error:", err));
                
                navigate(`/interview/${interview._id}/feedback`);
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error("Submit error:", err);
            setError("Failed to submit your answer. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stopCamera = () => {
        setIsCameraActive(false);
    };

    const handleEndSession = () => {
        setModalConfig({
            type: 'confirm',
            title: 'End Session Early?',
            message: 'Are you sure you want to end the interview early? Unanswered questions will not be scored.',
            confirmText: 'Yes, End Session',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setModalConfig(null);
                setIsSubmitting(true);
                stopSpeechSynthesis();
                stopCamera();
                if (recognitionRef.current) recognitionRef.current.stop();
                
                try {
                    await generateCheatingReport(interview._id).catch(err => console.error("Report generation error:", err));
                    navigate(`/interview/${interview._id}/feedback`);
                } catch (err) {
                    console.error(err);
                    navigate(`/interview/${interview._id}/feedback`);
                }
            },
            onCancel: () => setModalConfig(null)
        });
    };

    const isOrbModulating = isAiSpeaking || isUserSpeaking;

    const handleRunCode = () => {
        setCodeOutput("Running...");
        setTimeout(() => {
            setCodeOutput("Code execution simulated successfully. (Execution engine not connected).");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Initialization Overlay */}
            {!hasStartedInterview && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-md">
                    {/* Decorative background blobs to make the translucency pop */}
                    <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-10 rounded-[32px] max-w-lg w-full text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col items-center space-y-8 relative z-10">
                        <div className="relative">
                            {isProctoringInitialized ? (
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100 shadow-sm">
                                    <ShieldAlert size={40} className="text-green-500" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100 shadow-sm animate-pulse">
                                    <Activity size={40} className="text-blue-500" />
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
                                {isProctoringInitialized ? "Environment Secured" : "Initializing Proctoring"}
                                <span className="text-blue-600">.</span>
                            </h2>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                {isProctoringInitialized 
                                    ? "Your environment checks are complete. AI monitoring is active. You may begin the interview when ready." 
                                    : "Please wait while we spin up the AI face detection and proctoring microservices. This may take a few seconds..."}
                            </p>
                        </div>
                        
                        {!isProctoringInitialized ? (
                            <div className="w-full flex flex-col items-center space-y-3 mt-2">
                                <Loader2 className="animate-spin text-blue-600" size={28} />
                                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Warming up models...</span>
                            </div>
                        ) : (
                            <button 
                                onClick={handleStartInterview}
                                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
                            >
                                <span>Start Interview</span>
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className={`w-full max-w-[1500px] h-[90vh] grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-700 ${!hasStartedInterview ? 'scale-[0.98] opacity-40 blur-[2px] pointer-events-none' : ''}`}>
                
                {/* LEFT COLUMN: Camera & Robot/Code Editor */}
                <div className="lg:col-span-5 flex flex-col gap-4 h-full min-h-0">
                    
                    {/* CAMERA PANEL (Top) */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col flex-1 min-h-[300px]"
                    >
                        <div className="flex items-center justify-between mb-2 z-10">
                            <h2 className="text-sm font-bold text-gray-800 flex items-center">
                                <Video className="text-blue-500 mr-2" size={16} />
                                AI Monitor
                            </h2>
                            {isCameraActive ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></span>
                                    Active
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold flex items-center">
                                    <VideoOff className="mr-1" size={12} />
                                    Inactive
                                </span>
                            )}
                        </div>
                        <div className="relative aspect-video w-full bg-gray-900 rounded-2xl overflow-hidden border-[3px] border-gray-100 shadow-lg flex items-center justify-center">
                            {isCameraActive && !isVideoLoaded && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-gray-900 z-10 text-white">
                                    <Loader2 className="animate-spin text-blue-500" size={24} />
                                    <p className="text-[10px] font-mono tracking-widest text-blue-400">ACTIVATING CAMERA SENSOR...</p>
                                </div>
                            )}
                            {isCameraActive ? (
                                <img 
                                    src={`http://localhost:8001/video-feed/${interview._id}`}
                                    alt="AI Proctor Feed"
                                    className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setIsVideoLoaded(true)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white flex-col space-y-2">
                                    <Loader2 className="animate-spin text-blue-500" size={24} />
                                    <p className="text-xs">Initializing...</p>
                                </div>
                            )}

                            {isCameraActive && (
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-green-500/30 flex items-center gap-1.5 font-mono text-[9px] text-green-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    <span>SECURED</span>
                                </div>
                            )}

                            {/* Blinking Red Alert panel inside video block */}
                            {cheatingAlert && (
                                <div className="absolute inset-0 bg-red-600/20 border-4 border-red-500 flex items-center justify-center p-4 z-20 pointer-events-none transition-all duration-300">
                                    <div className="bg-black/95 p-4 rounded-2xl border border-red-500 flex flex-col items-center max-w-[280px] text-center shadow-2xl animate-[bounce_1s_infinite]">
                                        <ShieldAlert size={36} className="text-red-500 mb-2" />
                                        <p className="text-xs font-bold text-white uppercase tracking-wider">Proctoring Alert</p>
                                        <p className="text-[10px] text-red-300 mt-1 font-mono">{cheatingAlert}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* ROBOT RECRUITER PANEL (Bottom Left) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-50 border border-slate-200 p-5 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col flex-1 w-full overflow-hidden min-h-[300px]"
                    >
                        <div className="flex-1 bg-transparent rounded-2xl overflow-hidden relative min-h-0 flex items-center justify-center select-none">
                            <style dangerouslySetInnerHTML={{__html: `
                                @keyframes liquid-orb-silent {
                                    0%, 100% { border-radius: 50%; transform: scale(1.0) rotate(0deg); }
                                    50% { border-radius: 48% 52% 49% 51% / 50% 49% 51% 50%; transform: scale(1.02) rotate(15deg); }
                                }
                                @keyframes liquid-orb-active {
                                    0%, 100% { border-radius: 40% 60% 70% 30% / 45% 45% 55% 55%; transform: scale(1.08) rotate(0deg); }
                                    33% { border-radius: 65% 35% 50% 50% / 55% 45% 55% 45%; transform: scale(1.18) rotate(120deg); }
                                    66% { border-radius: 45% 55% 35% 65% / 40% 60% 40% 60%; transform: scale(1.05) rotate(240deg); }
                                }
                                @keyframes pulse-expand-active {
                                    0% { transform: scale(0.9); opacity: 0.6; }
                                    50% { transform: scale(1.6); opacity: 0.25; }
                                    100% { transform: scale(2.2); opacity: 0; }
                                }
                                @keyframes pulse-expand-silent {
                                    0% { transform: scale(0.9); opacity: 0.3; }
                                    50% { transform: scale(1.1); opacity: 0.1; }
                                    100% { transform: scale(1.3); opacity: 0; }
                                }
                            `}} />

                            <div className="relative w-56 h-56 flex items-center justify-center">
                                <div 
                                    className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl transition-all duration-500"
                                    style={{
                                        opacity: isOrbModulating ? 0.35 : 0.15,
                                        animation: isOrbModulating ? 'pulse-expand-active 3s infinite ease-out' : 'pulse-expand-silent 5s infinite ease-out'
                                    }}
                                ></div>
                                <div 
                                    className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 blur-2xl transition-all duration-500"
                                    style={{
                                        opacity: isOrbModulating ? 0.35 : 0.15,
                                        animation: isOrbModulating ? 'pulse-expand-active 4.5s infinite ease-out' : 'pulse-expand-silent 7.5s infinite ease-out'
                                    }}
                                ></div>
                                
                                <div 
                                    className="w-32 h-32 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 shadow-[0_0_50px_rgba(168,85,247,0.7)] flex items-center justify-center relative overflow-hidden transition-all duration-500"
                                    style={{
                                        animation: isOrbModulating ? 'liquid-orb-active 4s infinite linear' : 'liquid-orb-silent 8s infinite ease-in-out',
                                        boxShadow: isOrbModulating ? '0 0 60px rgba(168,85,247,0.9)' : '0 0 30px rgba(168,85,247,0.4)',
                                        transform: isOrbModulating ? 'scale(1.1)' : 'scale(1.0)'
                                    }}
                                >
                                    <div className="absolute inset-1.5 bg-[#090d16] rounded-full flex items-center justify-center">
                                        <div 
                                            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 filter blur-md transition-all duration-500"
                                            style={{
                                                opacity: isOrbModulating ? 0.9 : 0.4,
                                                transform: isOrbModulating ? 'scale(1.3)' : 'scale(1.0)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: Q&A Conversational UI */}
                <div className="lg:col-span-7 h-full min-h-0 flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col flex-1 min-h-0 relative overflow-hidden"
                    >
                        {/* Header Bar */}
                        <div className="mb-6 flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    Q {currentQuestionIndex + 1} / {questions.length}
                                </div>
                                {cheatingAlertsCount > 0 && (
                                    <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-red-200 animate-pulse">
                                        <AlertTriangle size={14} />
                                        Warnings: {cheatingAlertsCount}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleEndSession}
                                disabled={isSubmitting}
                                className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-xs font-bold transition-colors border border-red-100"
                            >
                                End Session
                            </button>
                        </div>

                        {/* Main Workspace Area (Chat History OR Code Editor) */}
                        {/* Main Workspace Area (Chat History OR Code Editor) */}
                        <div ref={chatContainerRef} className="flex-1 flex flex-col min-h-0 overflow-y-auto mb-4 pr-2 space-y-6">
                            
                            {/* Render Previous Conversation History */}
                            {conversationHistory.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* AI Question Bubble */}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                                            <Bot className="text-white" size={20} />
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 rounded-tl-none shadow-sm flex-1 opacity-75">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Recruiter</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 leading-relaxed">
                                                {item.question}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    {/* User Submitted Answer */}
                                    <div className="flex gap-4 flex-row-reverse mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 border border-gray-300 shadow-sm">
                                            <span className="font-bold text-gray-600 text-sm">YOU</span>
                                        </div>
                                        <div className="bg-gray-500 text-white rounded-2xl p-4 rounded-tr-none shadow-md max-w-[85%] whitespace-pre-wrap text-[15px] leading-relaxed">
                                            {item.answer}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}

                            {/* ALWAYS show the Current AI Question Bubble so they know what to answer */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/30">
                                    <Bot className="text-white" size={20} />
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 rounded-tl-none shadow-sm flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Recruiter (Current)</span>
                                        <button 
                                            onClick={() => speakQuestion(currentQuestion)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Repeat Question"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-relaxed">
                                        {currentQuestion}
                                    </h3>
                                </div>
                            </div>
                            
                            {/* User Answer Bubble (Shows up while typing or dictating) */}
                            {userAnswer.trim() && activeRightPanel === 'chat' && (
                                <div className="flex gap-4 flex-row-reverse mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 shadow-sm">
                                        <span className="font-bold text-blue-600 text-sm">YOU</span>
                                    </div>
                                    <div className="bg-blue-600 text-white rounded-2xl p-4 rounded-tr-none shadow-md max-w-[85%] whitespace-pre-wrap text-[15px] leading-relaxed">
                                        {userAnswer}
                                    </div>
                                </div>
                            )}
                            
                            {/* Toggle between Code Editor and Chat Input History */}
                            {activeRightPanel === 'editor' && (
                                <div className="flex-1 bg-[#1e1e1e] rounded-2xl overflow-hidden flex flex-col border-[3px] border-gray-800 min-h-[300px]">
                                    <div className="bg-[#2d2d2d] px-3 py-2 flex items-center justify-between border-b border-black">
                                        <div className="flex items-center gap-2">
                                            <Code className="text-blue-400" size={14} />
                                            <select 
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                className="bg-[#1e1e1e] text-gray-300 border border-gray-600 rounded px-2 py-1 text-xs font-mono outline-none focus:border-blue-500 cursor-pointer"
                                            >
                                                <option value="javascript">JavaScript</option>
                                                <option value="python">Python</option>
                                                <option value="java">Java</option>
                                                <option value="cpp">C++</option>
                                            </select>
                                        </div>
                                        <button 
                                            onClick={handleRunCode}
                                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded transition shadow-md"
                                        >
                                            Run Code
                                        </button>
                                    </div>
                                    <textarea
                                        value={codeAnswer}
                                        onChange={(e) => setCodeAnswer(e.target.value)}
                                        disabled={isSubmitting}
                                        className="flex-1 w-full p-4 bg-transparent text-gray-300 font-mono text-sm outline-none resize-none min-h-0"
                                        spellCheck="false"
                                        placeholder="// Write your code here..."
                                        style={{ lineHeight: '1.6', tabSize: 4 }}
                                    />
                                    {codeOutput && (
                                        <div className="h-24 bg-black border-t border-gray-800 p-3 overflow-y-auto shrink-0">
                                            <p className="text-gray-400 text-xs font-mono mb-1">$ Output:</p>
                                            <p className={`text-sm font-mono ${codeOutput === 'Running...' ? 'text-yellow-500 animate-pulse' : 'text-green-400'}`}>
                                                {codeOutput}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Chat Input Bar (Only visible in chat mode, or disabled in editor) */}
                        <div className="pt-4 border-t border-gray-100 shrink-0">
                            {error && <div className="text-red-500 text-sm font-bold mb-3 text-center bg-red-50 p-2 rounded-lg">{error}</div>}
                            
                            <div className="flex flex-col gap-3">
                                {/* Input Container - Hidden when coding so they focus on code */}
                                {activeRightPanel === 'chat' && (
                                    <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10">
                                        <textarea
                                            className="flex-1 w-full bg-transparent outline-none resize-none text-gray-700 text-base min-h-[44px] max-h-[120px] p-2 placeholder:text-gray-400"
                                            placeholder="Type your answer or use voice dictation..."
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            disabled={isSubmitting}
                                            rows={Math.min(4, Math.max(1, userAnswer.split('\n').length))}
                                        />
                                        {speechSupported && (
                                            <button 
                                                onClick={toggleListening}
                                                className={`p-3 rounded-xl transition-all shrink-0 mb-1 ${
                                                    isListening ? 'bg-red-500 text-white animate-pulse shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                                                }`}
                                            >
                                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Action Bar */}
                                <div className="flex justify-between items-center mt-1">
                                    <button
                                        onClick={() => setActiveRightPanel(prev => prev === 'editor' ? 'chat' : 'editor')}
                                        className={`px-5 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all text-sm border ${
                                            activeRightPanel === 'editor' 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Code size={18} />
                                        <span>{activeRightPanel === 'editor' ? 'Close Compiler' : 'Open Compiler'}</span>
                                    </button>

                                    <button
                                        onClick={handleSubmitAnswer}
                                        disabled={isSubmitting || (!userAnswer.trim() && codeAnswer.trim() === '// Write your code here...')}
                                        className="px-6 py-3 rounded-xl font-bold text-white flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md disabled:opacity-50 transition-all text-sm transform hover:-translate-y-0.5"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="animate-spin" size={18} /><span>Saving...</span></>
                                        ) : isLastQuestion ? (
                                            <><span>Finish Interview</span><Check size={18} /></>
                                        ) : (
                                            <><span>Save & Next Question</span><ChevronRight size={18} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
            </div>

            {/* Custom Modal Overlay */}
            {modalConfig && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-100"
                    >
                        <div className={`px-6 py-4 border-b flex items-center gap-3 ${modalConfig.type === 'alert' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                            {modalConfig.type === 'alert' ? (
                                <AlertTriangle className="text-red-500" size={24} />
                            ) : (
                                <ShieldAlert className="text-blue-500" size={24} />
                            )}
                            <h3 className={`font-bold text-lg ${modalConfig.type === 'alert' ? 'text-red-800' : 'text-gray-800'}`}>
                                {modalConfig.title}
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {modalConfig.message}
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                            {modalConfig.type === 'confirm' && (
                                <button 
                                    onClick={modalConfig.onCancel}
                                    className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    {modalConfig.cancelText || 'Cancel'}
                                </button>
                            )}
                            <button 
                                onClick={modalConfig.onConfirm}
                                className={`px-6 py-2 rounded-xl text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 ${
                                    modalConfig.type === 'alert' ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'
                                }`}
                            >
                                {modalConfig.confirmText || 'OK'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default InterviewSession;
