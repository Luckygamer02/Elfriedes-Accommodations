"use client"
import Uploadprogressbar from "@/components/upload/uploadprogressbar";
import Uploadform from "@/components/upload/form"
import React, {useState} from "react";
import {useAuthGuard} from "@/lib/auth/use-auth";
import Loading from "@/components/loading";


export default function UploadAccommodation() {

    const [activeStep, setActiveStep] = useState(1);
    const {user} = useAuthGuard({middleware: "auth"});
    if (!user) return <Loading/>;
    return (
        <div className="flex flex-row">
            <Uploadprogressbar activeStep={activeStep}/>
            <Uploadform userid={user.id} step={activeStep} setActiveStep={setActiveStep}/>
        </div>

    );
}
