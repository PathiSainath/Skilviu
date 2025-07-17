import React from 'react';
import scams from '../Assets/scams.png';
import jobsearch from '../Assets/jobsearch.png';
import job from '../Assets/job.png';

function Scams() {
    return (
        <div>
            {/* SECTION 1: Scam Fee Warning */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white px-8 py-20">
                {/* Text Section */}
                <div className="md:w-[55%] space-y-6 pr-4">
                    <h2 className="text-4xl font-semibold text-blue-900">
                        Skilviu Soft Solutions LLP doesn't charge candidates any money.
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Skilviu Soft Solutions LLP will never ask candidates for any recruitment fees. Please be
                        cautioned that individuals/organizations are misusing the Skilviu Soft Solutions LLP
                        brand name to demand money in exchange for interviews or jobs with
                        Skilviu Soft Solutions LLP or clients of Skilviu.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Do note that they wrongfully use the company’s registered trademark on
                        fake job advertisements and emails to harm innocent victims.
                    </p>
                </div>

                {/* Image Section */}
                <div className="md:w-[45%] mt-8 md:mt-0 flex justify-center md:justify-end md:mr-12">
                    <img
                        src={scams}
                        alt="Scam Warning"
                        className="w-full max-w-[400px] md:max-w-[450px] h-auto"
                    />
                </div>
            </div>

            {/* SECTION 2: Job Search Safety Message */}
            <div className="flex flex-col md:flex-row">
                {/* Text Section */}
                <div className="md:w-1/2 bg-[#0b1444] text-white p-10 flex flex-col justify-center">
                    <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
                        your safety during <br />
                        the job search <br />
                        process is our <br />
                        priority.
                    </h2>
                    <p className="text-lg text-gray-300">
                        At Skilviu Soft Solutions LLP, our candidates’ safety during their job search process is
                        our top priority. Unfortunately, some job seekers may accidentally fall victim to job
                        scams in India. Our recruitment consultants adhere to a structured process to ensure we
                        maintain the highest level of integrity.
                    </p>
                </div>

                {/* Image Section */}
                <div className="md:w-1/2 w-full">
                    <img
                        src={jobsearch}
                        alt="Job Search Safety"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            {/* SECTION 3: What is a Job Scam? */}
            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-32 bg-white min-h-[750px]">
                {/* Image Section */}
                <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
                    <img
                        src={job}
                        alt="What is a job scam?"
                        className="w-full max-w-[500px] md:max-w-[600px] h-auto"
                    />
                </div>

                {/* Text Section */}
                <div className="md:w-1/2 md:pl-12 space-y-6">
                    <h2 className="text-5xl font-semibold text-blue-900 leading-tight">
                        what is a job scam?
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Recruitment scams often involve fake online job ads on social platforms and untrusted
                        job portals offering high-paying jobs. Victims may also receive unsolicited text messages
                        or messages from Facebook and WhatsApp that provide jobs that do not exist.
                    </p>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Job scammers will ask victims to share personal information such as their mobile number
                        OR transfer or remit a small sum of money to secure the fake interview or for more
                        information about the fraudulent jobs.
                    </p>
                </div>
            </div>

            {/* SECTION 4: How to Spot Fake Job Postings */}
            <div className="bg-white px-8 py-20">
                <div className="max-w-5xl mx-auto space-y-8">
                    <h2 className="text-4xl font-semibold text-blue-900">
                        How to spot fake job postings?
                    </h2>
                    <p className="text-lg text-gray-700">
                        Identify fake job offers with these ten warning signs of scams:
                    </p>
                    <ul className="list-disc pl-6 space-y-4 text-lg text-gray-700">
                        <li>
                            If money is involved — you’ve been asked to transfer money for a medical check,
                            work pass application, or to attend the job interview.
                        </li>
                        <li>
                            The company has no website or official/corporate social media account.
                        </li>
                        <li>
                            The job offer was sent from a personal email, a “no-reply” email, and not from the
                            Skilviu domain.
                        </li>
                        <li>
                            You did not apply for the job.
                        </li>
                        <li>
                            The job is too good to be true.
                        </li>
                        <li>
                            The job description is unclear or too short.
                        </li>
                        <li>
                            Poor use of the English language with multiple typos and grammatical errors in the job
                            advertisement or text messages.
                        </li>
                        <li>
                            You found the job posting in a random social media community.
                        </li>
                        <li>
                            Communication channels are limited to social media and messaging platforms such as Facebook,
                            WhatsApp, etc.
                        </li>
                        <li>
                            On messaging platforms, they ask you for your personal information, such as your mobile
                            number or ID photo.
                        </li>
                    </ul>
                    <p className="text-lg text-gray-700">
                        When looking for a job, please do not respond to fraudulent job advertisements often shared
                        in unsolicited Facebook groups or messaging platforms.
                    </p>
                    <p className="text-lg text-gray-700">
                        You should not respond to suspicious job offers in email or messaging platforms (Facebook
                        Messenger, WhatsApp, etc.) or calls from unknown numbers.
                    </p>
                    <p className="text-lg text-gray-700">
                        Remember that disclosing your personal and banking details to anyone you do not know is never safe.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Scams;
