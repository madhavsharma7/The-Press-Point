import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./sub.css";
import "./media.css";

const Subscribe = () => {
    const [email, setEmail] = useState("");
    const [isChecked, setIsChecked] = useState(false);

    const sendMail = () => {
        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        if (!isChecked) {
            alert("You must agree to the terms before subscribing.");
            return;
        }

        const serviceID = "service_ciw9939";
        const templateID = "template_qmdxeeh";
        const publicKey = "ze1-SY3Aypt5Y3dFO";

        emailjs.init(publicKey);

        const params = { email };

        emailjs
            .send(serviceID, templateID, params)
            .then((res) => {
                setEmail("");
                setIsChecked(false);
                console.log("Subscription successful:", res);
                alert("Subscription Successful!");
            })
            .catch((err) => {
                console.error("Failed to send subscription request. Error details:", err);
                alert("Failed to subscribe. Please try again.");
            });
    };

    return (
        <div id="main">
        <div className="subscribe">
            <h2 className="subscribe__title">Let's keep in touch</h2>
            <p className="subscribe__copy">
                Subscribe to keep up with fresh news and exciting updates. We promise
                not to spam you!
            </p>
            <div className="form">
                <input
                    type="email"
                    className="form__email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="form__button" onClick={sendMail}>Send</button>
            </div>
            <div className="notice">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span className="notice__copy">
                    I agree to my email address being stored and used to receive monthly newsletters.
                </span>
            </div>
        </div>
        </div>
    );
};

export default Subscribe;
