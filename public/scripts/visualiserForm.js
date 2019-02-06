/* 
 * David Sanchez
 * Newcastle University. 2016
 * 
 * This code creates a practice.
 * A practice could be used to explore new questions and general purpose questions.
 * 
 */





//Creates a new visualiwer
var visualiser = new Visualiser(
"R1: Deny if PATIENT_disagrees\n\
R2: Permit if OR(HOSPITAL_agrees,SURGEON_agrees)\n\
P: DOV(R1, R2)",
{"PATIENT_disagrees": "False", "HOSPITAL_agrees": "False", "SURGEON_agrees": "True"});





//==============================================================================
//New lines inside Strings can be marked using "\n" and String.fromCharCode(13)





//==============================================================================
var sample = new Sample(
"1a",
"PA: Permit if NEWCASTLE_student\n\
PB: Deny if FEE_due\n\
PC: POV(PA, PB)",
{"NEWCASTLE_student": "False", "FEE_due": "False"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"1b",
"PA: Permit if NEWCASTLE_student\n\
PB: Deny if FEE_due\n\
PC: DUP(PA, PB)",
{"NEWCASTLE_student": "True", "FEE_due": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================)
var sample = new Sample(
"1c",
"PA: Permit if NEWCASTLE_student\n\
PB: Deny if FEE_due\n\
PC: PUD(PA, PB)",
{"NEWCASTLE_student": "Unknown", "FEE_due": "True"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"1d",
"PA: Permit if NEWCASTLE_student\n\
PB: Deny if FEE_due\n\
PC: FA(PA, PB)",
{"NEWCASTLE_student": "Unknown", "FEE_due": "Unknown"});
visualiser.pushSample(sample);





//==============================================================================
var sample = new Sample(
"2a",
"PA: Permit if NEWCASTLE_student\n\
PB: Permit if GYM_paid\n\
PC: DOV(PA, PB)",
{"NEWCASTLE_student": "False", "GYM_paid": "False"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"2b",
"PA: Permit if NEWCASTLE_student\n\
PB: Deny if GYM_paid\n\
PC: POV(PA, PB)",
{"NEWCASTLE_student": "Unknown", "GYM_paid": "True"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"2c",
"PA: Permit if NEWCASTLE_student\n\
PB: Deny if GYM_paid\n\
PC: DUP(PA, PB)",
{"NEWCASTLE_student": "Unknown", "GYM_paid": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"2d",
"PA: Permit if NEWCASTLE_student\n\
PB: Deny if GYM_paid\n\
PC: OOA(PA, PB)",
{"NEWCASTLE_student": "True", "GYM_paid": "Unknown"});
visualiser.pushSample(sample);





//==============================================================================
var sample = new Sample(
"3a",
"PX: Deny if BILL_unpaid\n\
PY: Permit if OR(OWNER_allow, JUDGE_allow)\n\
PZ: DOV( PX, PY)",
{"JUDGE_allow": "False", "OWNER_allow": "False", "BILL_unpaid": "False"});
visualiser.pushSample(sample);

//============================================================================== 
var sample = new Sample(
"3b",
"PX: Deny if BILL_unpaid\n\
PY: Permit if OR(OWNER_allow, JUDGE_allow)\n\
PZ: POV( PX, PY)",
{"JUDGE_allow": "True", "OWNER_allow": "False", "BILL_unpaid": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"3c",
"PX: Deny if BILL_unpaid\n\
PY: Permit if OR(OWNER_allow, JUDGE_allow)\n\
PZ: DUP( PX, PY)",
{"JUDGE_allow": "Unknown", "OWNER_allow": "False", "BILL_unpaid": "Unknown"});
visualiser.pushSample(sample);

//============================================================================== 
var sample = new Sample(
"3d",
"PX: Deny if BILL_unpaid\n\
PY: Permit if OR(OWNER_allow, JUDGE_allow)\n\
PZ: PUD( PX, PY)",
{"JUDGE_allow": "Unknown", "OWNER_allow": "False", "BILL_unpaid": "Unknown"});
visualiser.pushSample(sample);





//==============================================================================   
var sample = new Sample(
"4a",
"PA: Permit if PATIENT_agrees\n\
PB: Deny if OR(HOSPITAL_disagrees,SURGEON_disagrees)\n\
PC: DUP(PA,PB)",
{"PATIENT_agrees": "False", "HOSPITAL_disagrees": "False", "SURGEON_disagrees": "False"});
visualiser.pushSample(sample);

//==============================================================================   
var sample = new Sample(
"4b",
"PA: Permit if PATIENT_agrees\n\
PB: Deny if OR(HOSPITAL_disagrees,SURGEON_disagrees)\n\
PC: PUD(PA,PB)",
{"PATIENT_agrees": "True", "HOSPITAL_disagrees": "False", "SURGEON_disagrees": "False"});
visualiser.pushSample(sample);

//==============================================================================   
var sample = new Sample(
"4c",
"PA: Permit if PATIENT_agrees\n\
PB: Deny if OR(HOSPITAL_disagrees,SURGEON_disagrees)\n\
PC: FA(PA,PB)",
{"PATIENT_agrees": "False", "HOSPITAL_disagrees": "False", "SURGEON_disagrees": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================
//Illustration purpose test
//var sample = new Sample(
//"4d",
//"[Same context as previous question]\n\
//\n\
//Releasing medical records in a certain hospital requires compliance with an access control policy. The system checks events with statements that return True or False if the forms have been filled and validated by the corresponding departments.",
//{"PATIENT_disagrees": "False", "HOSPITAL_agrees": "False", "SURGEON_agrees": "True"},
//{"R1": "Deny if PATIENT_disagrees",
//    "R2": "Permit if OR(HOSPITAL_agrees,SURGEON_agrees)",
//    "P": "DOV(R1, R2)"},
//"Can you change the radio buttons so that PC evaluates to Deny ?",
//"Deny",
//{"PATIENT_disagrees": "True", "HOSPITAL_agrees": "False", "SURGEON_agrees": "False"},
//"graphic",
//"R1: Deny if PATIENT_disagrees\n\
//R2: Permit if OR(HOSPITAL_agrees,SURGEON_agrees)\n\
//P: DOV(R1,R2)");
//visualiser.pushSample(sample);

//==============================================================================   
var sample = new Sample(
"4d",
"PA: Deny if PATIENT_disagrees\n\
PB: Permit if OR(HOSPITAL_agrees,SURGEON_agrees)\n\
PC: DOV(PA,PB)",
{"PATIENT_disagrees": "False", "HOSPITAL_agrees": "False", "SURGEON_agrees": "True"});
visualiser.pushSample(sample);





//==============================================================================   
var sample = new Sample(
"5a",
"PA: Permit if AND(SAFETY_check, OPERATIONS_check)\n\
PB: Deny if ENGINEERING_uncheck\n\
PC: Permit if HQ_check\n\
PD: DOV(PA,PB)\n\
PE: DUP(PD,PC)",
{"HQ_check": "False", "ENGINEERING_uncheck": "False", "SAFETY_check": "False", "OPERATIONS_check": "False"});
visualiser.pushSample(sample);

//==============================================================================   
var sample = new Sample(
"5b",
"PA: Permit if AND(SAFETY_check, OPERATIONS_check)\n\
PB: Deny if ENGINEERING_uncheck\n\
PC: Permit if HQ_check\n\
PD: DUP(PA,PB)\n\
PE: DOV(PD,PC)",
{"HQ_check": "Unknown", "ENGINEERING_uncheck": "Unknown", "SAFETY_check": "True", "OPERATIONS_check": "True"});
visualiser.pushSample(sample);

//==============================================================================   
var sample = new Sample(
"5c",
"PA: Permit if AND(SAFETY_check, OPERATIONS_check)\n\
PB: Deny if ENGINEERING_uncheck\n\
PC: Permit if HQ_check\n\
PD: DUP(PA,PB)\n\
PE: DOV(PD,PC)",
{"HQ_check": "True", "ENGINEERING_uncheck": "False", "SAFETY_check": "Unknown", "OPERATIONS_check": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================   
var sample = new Sample(
"5d",
"PA: Permit if AND(SAFETY_check, OPERATIONS_check)\n\
PB: Deny if ENGINEERING_uncheck\n\
PC: Permit if HQ_check\n\
PD: DOV(PA,PB)\n\
PE: OOA(PD,PC)",
{"HQ_check": "True", "ENGINEERING_uncheck": "False", "SAFETY_check": "Unknown", "OPERATIONS_check": "Unknown"});
visualiser.pushSample(sample);





//==============================================================================
var sample = new Sample(
"6a",
"PA: Deny if AND(FINGER_notok,HANDSHAPE_notok)\n\
PB: Permit if VOICE_ok \n\
PC: Deny if RETINA_notok\n\
PD: PUD(PA,PB) \n\
PE: FA(PD,PC) \n\ ",
{"RETINA_notok": "True", "VOICE_ok": "Unknown", "FINGER_notok": "True", "HANDSHAPE_notok": "True"});
visualiser.pushSample(sample);
//==============================================================================
var sample = new Sample(
"6b",
"PA: Deny if AND(FINGER_notok,HANDSHAPE_notok)\n\
PB: Permit if VOICE_ok \n\
PC: Deny if RETINA_notok\n\
PD: PUD(PA,PB) \n\
PE: PUD(PD,PC) \n\ ",
{"RETINA_notok": "False", "VOICE_ok": "False", "FINGER_notok": "Unknown", "HANDSHAPE_notok": "False"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"6c",
"PA: Deny if AND(FINGER_notok,HANDSHAPE_notok)\n\
PB: Permit if VOICE_ok \n\
PC: Deny if RETINA_notok\n\
PD: FA(PA,PB) \n\
PE: PUD(PD,PC) \n\ ",
{"RETINA_notok": "True", "VOICE_ok": "Unknown", "FINGER_notok": "True", "HANDSHAPE_notok": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"6d",
"PA: Deny if AND(FINGER_notok,HANDSHAPE_notok)\n\
PB: Permit if VOICE_ok \n\
PC: Deny if RETINA_notok\n\
PD: FA(PA,PB) \n\
PE: OOA(PD,PC) \n\ ",
{"RETINA_notok": "Unknown", "VOICE_ok": "Unknown", "FINGER_notok": "Unknown", "HANDSHAPE_notok": "True"});
visualiser.pushSample(sample);





//==============================================================================
var sample = new Sample(
"7a",
"PA: Permit if AND(PRESSURE_high,SPEED_notlow)\n\
PB: Permit if AND(OXIGEN_nothigh,WIND_low)\n\
PC: Deny if OR(SPEED_notlow,AND(PRESSURE_high, OXIGEN_nothigh))\n\
PD: POV(PB,PC)\n\
PE: DOV(PD,PA)\n\
PF: POV(PA,PE)",
{"PRESSURE_high": "False", "OXIGEN_nothigh": "True", "SPEED_notlow": "True", "WIND_low": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"7b",
"PA: Permit if AND(PRESSURE_high,SPEED_notlow)\n\
PB: Permit if AND(OXIGEN_nothigh,WIND_low)\n\
PC: Deny if OR(SPEED_notlow,AND(PRESSURE_high, OXIGEN_nothigh))\n\
PD: POV(PB,PC)\n\
PE: DOV(PD,PA)\n\
PF: POV(PA,PE)",
{"PRESSURE_high": "False", "OXIGEN_nothigh": "True", "SPEED_notlow": "True", "WIND_low": "Unknown"});
visualiser.pushSample(sample);

//==============================================================================  
var sample = new Sample(
"7c",
"PA: Permit if AND(PRESSURE_high,SPEED_notlow)\n\
PB: Permit if AND(OXIGEN_nothigh,WIND_low)\n\
PC: Deny if OR(SPEED_notlow,AND(PRESSURE_high, OXIGEN_nothigh))\n\
PD: POV(PB,PC)\n\
PE: DOV(PD,PA)\n\
PF: DOV(PA,PE)",
{"PRESSURE_high": "Unknown", "OXIGEN_nothigh": "False", "SPEED_notlow": "False", "WIND_low": "True"});
visualiser.pushSample(sample);

//==============================================================================  
var sample = new Sample(
"7d",
"PA: Permit if AND(PRESSURE_high,SPEED_notlow)\n\
PB: Permit if AND(OXIGEN_nothigh,WIND_low)\n\
PC: Deny if OR(SPEED_notlow,AND(PRESSURE_high, OXIGEN_nothigh))\n\
PD: POV(PB,PC)\n\
PE: POV(PD,PA)\n\
PF: POV(PA,PE)",
{"PRESSURE_high": "True", "OXIGEN_nothigh": "True", "SPEED_notlow": "False", "WIND_low": "True"});
visualiser.pushSample(sample);





//==============================================================================
var sample = new Sample(
"8a",
"OSA: Permit if AND(CAR_moving, BRAKE_pressed)\n\
OSB: Deny if TRACTION_notfailed\n\
OSD: Permit if BRAKE_2s\n\
OSC: DOV(OSA,OSB)\n\
OSE: DOV(OSD,OSC)\n\
HSA: Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok)\n\
HSB: Permit if PUMP_ok\n\
HSD: Deny if OPERATIONS_notok \n\
HSC: POV(HSA,HSB)\n\
HSE: DOV(HSC,HSD)\n\
AP: POV(OSE,HSE)",
{"HYDRAULICS1_ok": "False",
    "HYDRAULICS2_ok": "False",
    "PUMP_ok": "False",
    "OPERATIONS_notok": "False",
    "CAR_moving": "False",
    "BRAKE_pressed": "False",
    "TRACTION_notfailed": "False",
    "BRAKE_2s": "False"},
{"OSA": "Permit if AND(CAR_moving, BRAKE_pressed)",
    "OSB": "Deny if TRACTION_notfailed",
    "OSD": "Permit if BRAKE_2s",
    "OSC": "DOV(OSA,OSB)",
    "OSE": "DOV(OSD,OSC)",
    "HSA": "Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok)",
    "HSB": "Permit if PUMP_ok",
    "HSD": "Deny if OPERATIONS_notok",
    "HSC": "POV(HSA,HSB)",
    "HSE": "DOV(HSC,HSD)",
    "AP": "DOV(OSE,HSE)"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"8b",
"OSA: Permit if AND(CAR_moving, BRAKE_pressed)\n\
OSB: Deny if TRACTION_notfailed\n\
OSD: Permit if BRAKE_2s\n\
OSC: FA(OSA,OSB)\n\
OSE: OOA(OSD,OSC)\n\
HSA: Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok)\n\
HSB: Permit if PUMP_ok\n\
HSD: Deny if OPERATIONS_notok \n\
HSC: PUD(HSA,HSB)\n\
HSE: DUP(HSC,HSD)\n\
AP: DOV(OSE,HSE)",
{"HYDRAULICS1_ok": "True",
    "HYDRAULICS2_ok": "False",
    "PUMP_ok": "True",
    "OPERATIONS_notok": "False",
    "CAR_moving": "Unknown",
    "BRAKE_pressed": "False",
    "TRACTION_notfailed": "False",
    "BRAKE_2s": "True"},
{"OSA": "Permit if AND(CAR_moving, BRAKE_pressed)",
    "OSB": "Deny if TRACTION_notfailed",
    "OSD": "Permit if BRAKE_2s",
    "OSC": "DOV(OSA,OSB)",
    "OSE": "DOV(OSD,OSC)",
    "HSA": "Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok)",
    "HSB": "Permit if PUMP_ok",
    "HSD": "Deny if OPERATIONS_notok",
    "HSC": "POV(HSA,HSB)",
    "HSE": "DOV(HSC,HSD)",
    "AP": "DOV(OSE,HSE)"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"8c",
"OSA: Permit if AND(CAR_moving, BRAKE_pressed)\n\
OSB: Deny if TRACTION_notfailed\n\
OSD: Permit if BRAKE_2s\n\
OSC: DOV(OSA,OSB)\n\
OSE: DOV(OSD,OSC)\n\
HSA: Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok)\n\
HSB: Permit if PUMP_ok\n\
HSD: Deny if OPERATIONS_notok \n\
HSC: POV(HSA,HSB)\n\
HSE: DOV(HSC,HSD)\n\
AP: FA(OSE,HSE)",
{"HYDRAULICS1_ok": "False",
    "HYDRAULICS2_ok": "False",
    "PUMP_ok": "True",
    "OPERATIONS_notok": "False",
    "CAR_moving": "True",
    "BRAKE_pressed": "False",
    "TRACTION_notfailed": "True",
    "BRAKE_2s": "True"},
{"OSA": "Permit if AND(CAR_moving, BRAKE_pressed)",
    "OSB": "Deny if TRACTION_notfailed",
    "OSD": "Permit if BRAKE_2s",
    "OSC": "DOV(OSA,OSB)",
    "OSE": "DOV(OSD,OSC)",
    "HSA": "Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok)",
    "HSB": "Permit if PUMP_ok",
    "HSD": "Deny if OPERATIONS_notok",
    "HSC": "POV(HSA,HSB)",
    "HSE": "DOV(HSC,HSD)",
    "AP": "DOV(OSE,HSE)"});
visualiser.pushSample(sample);

//==============================================================================
var sample = new Sample(
"8d",
"OSA: Permit if AND(CAR_moving, BRAKE_pressed)\n\
OSB: Deny if TRACTION_notfailed\n\
OSD: Permit if BRAKE_2s\n\
OSC: DOV(OSA,OSB)\n\
OSE: DOV(OSD,OSC)\n\
HSA: Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok) (Hydraulic fluid pressure normal) \n\
HSB: Permit if PUMP_ok\n\
HSD: Deny if OPERATIONS_notok \n\
HSC: POV(HSA,HSB)\n\
HSE: DOV(HSC,HSD)\n\
AP: OOA(OSE,HSE)",
{"HYDRAULICS1_ok": "Unknown",
    "HYDRAULICS2_ok": "False",
    "PUMP_ok": "False",
    "OPERATIONS_notok": "False",
    "CAR_moving": "Unknown",
    "BRAKE_pressed": "False",
    "TRACTION_notfailed": "Unknown",
    "BRAKE_2s": "Unknown"},
{"OSA": "Permit if AND(CAR_moving, BRAKE_pressed)",
    "OSB": "Deny if TRACTION_notfailed",
    "OSD": "Permit if BRAKE_2s",
    "OSC": "DOV(OSA,OSB)",
    "OSE": "DOV(OSD,OSC)",
    "HSA": "Permit if OR(HYDRAULICS1_ok, HYDRAULICS2_ok)",
    "HSB": "Permit if PUMP_ok",
    "HSD": "Deny if OPERATIONS_notok",
    "HSC": "POV(HSA,HSB)",
    "HSE": "DOV(HSC,HSD)",
    "AP": "DOV(OSE,HSE)"});
visualiser.pushSample(sample);






//==============================================================================   
var sample = new Sample(
"9a",
"PA: Permit if AND(SAFETY_check, OPERATIONS_check)\n\
PB: Deny if ENGINEERING_uncheck\n\
PC: Permit if HQ_check\n\
PD: DUP(PA,PB)\n\
PE: DOV(PD,PC,PD,PC,OOA(PA,PB),PD,PD,FA(PB,PC))",
{"HQ_check": "False", "ENGINEERING_uncheck": "False", "SAFETY_check": "False", "OPERATIONS_check": "False"});
visualiser.pushSample(sample);



//==============================================================================   
var sample = new Sample(
        "9b",
        "PA: Permit if AND(SAFETY_check, OPERATIONS_check)\n\
PB: Deny if ENGINEERING_uncheck\n\
PC: Permit if HQ_check\n\
PD: DUP(PA,PB)\n\
PE: DOV(PD,PC,PD,FA(PB,PC))",
        {"HQ_check": "False", "ENGINEERING_uncheck": "False", "SAFETY_check": "False", "OPERATIONS_check": "False"});
visualiser.pushSample(sample);












visualiser.show();