import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const Subscribe = () => {
    const [email, setEmail] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendMail = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        if (!isChecked) {
            toast.error("You must agree to the terms before subscribing.");
            return;
        }

        setLoading(true);

        const serviceID = "service_ciw9939";
        const templateID = "template_qmdxeeh";
        const publicKey = "ze1-SY3Aypt5Y3dFO";

        emailjs.init(publicKey);

        const params = { email };

        emailjs
            .send(serviceID, templateID, params)
            .then(() => {
                setEmail("");
                setIsChecked(false);
                setLoading(false);
                toast.success("Subscription Successful! Welcome aboard.");
            })
            .catch((err) => {
                console.error("Failed to send subscription request:", err);
                setLoading(false);
                toast.error("Failed to subscribe. Please try again.");
            });
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6">
                            <i className="fa-regular fa-envelope-open text-2xl text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                        <h2 className="text-center font-headline text-3xl font-extrabold text-slate-900 dark:text-white">
                            Let's keep in touch
                        </h2>
                        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                            Subscribe to keep up with fresh news and exciting updates. We promise not to spam you!
                        </p>
                    </div>
                    
                    <form className="mt-8 space-y-6" onSubmit={sendMail}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-regular fa-envelope text-slate-400"></i>
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded cursor-pointer"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    I agree to my email address being stored and used to receive monthly newsletters.
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <i className="fa-solid fa-spinner fa-spin"></i> Subscribing...
                                    </span>
                                ) : (
                                    "Subscribe Now"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Subscribe;
