import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";

const upload = () => {
  const [isProcessing, setisProcessing] = useState(false);
  const [statusText, setstatusText] = useState("")
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

  }
  
  return (
     <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
        <div className="page-heading py-16">
        <h1>Smart feedback for your dream job</h1>
        {isProcessing ? (
          <>
             <h2>{statusText}</h2>
             <img src="/images/resume-scan.gif" alt="Processing Resume" className="w-full"/>
          </>
        ) : (
          <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
               <div className="form-div">
                  <label htmlFor="company-name" >Company Name</label>
                  <input type="text" id="company-name" name="company-name" required />
               </div>
               <div className="form-div">
                  <label htmlFor="job-title" >Job Title</label>
                  <input type="text" id="job-title" name="job-title" required />
               </div>
               <div className="form-div">
                  <label htmlFor="job-description" >Job Description</label>
                  <textarea id="job-description" name="job-description" rows={6} required ></textarea>
               </div>
                <div className="form-div">
                  <label htmlFor="uploader" >Upload Resume</label>
                  <FileUploader />
                  </div>
                  <button className="primary-button" type ="submit">Analyze Resume</button>
            </form>
          )}
        </div>
    </section>
  </main>
  )
}


export default upload
