"use client"
import Uploadprogressbar from "@/components/upload/uploadprogressbar";
import Uploadform from "@/components/upload/form"
import {useState} from "react";


export default function UploadAccommodation() {

    const [activeStep, setActiveStep] = useState(0);
    return (
        <div className="flex flex-row">
            <Uploadprogressbar activeStep={activeStep}/>
            <Uploadform activeStep={activeStep} setActiveStep={setActiveStep} />
        </div>

    );
}
