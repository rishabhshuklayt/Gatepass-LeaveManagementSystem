const express = require("express");
const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const registrationSchema = require("./model/user");
const requestSchema = require("./model/leavedata");
const coordinatorSchema = require("./model/coordination");
const gatemanSchema = require("./model/gateman");
const bodyParser = require('body-parser')
const passport = require("passport");
const nodeMailer = require("nodemailer");
require("dotenv").config();

const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;
const port = 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "rishabh",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(registrationSchema.authenticate()));
passport.serializeUser(registrationSchema.serializeUser());
passport.deserializeUser(registrationSchema.deserializeUser());

// ---------------------

passport.use(new LocalStrategy(coordinatorSchema.authenticate()));
passport.serializeUser(coordinatorSchema.serializeUser());
passport.deserializeUser(coordinatorSchema.deserializeUser());

//----------------------

passport.use(new LocalStrategy(gatemanSchema.authenticate()));
passport.serializeUser(gatemanSchema.serializeUser());
passport.deserializeUser(gatemanSchema.deserializeUser());

app.set("view engine", "ejs");
// --------------------------------------------------
// { useNewUrlParser: true, useUnifiedTopology: true }
// mongoose
//   .connect("mongodb://localhost:27017/Registration")
//   .then(() => {
//     console.log("Connection established Succesfully ✅");
//   })
//   .catch((err) => {
//     console.log(`connection erroe ${err}`);
//   });

// atlas connection 

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connection established successfully ✅");
}).catch((err) => {
  console.log(`Connection error: ${err}`);
});

// -----------------------

app.get("/", isLoggedIn, (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/gateman_login", (req, res) => {
  res.render("gateman_login");
});

app.post("/gateman_login", async (req, res) => {
  const { empid, password } = req.body;
  try {
    const udata = await coordinatorSchema.findOne({ empid, password });

    // WE TAKE THIS LINE OF CODE IT HELPS US TO FETCH NAME AND INFORMATION USED TO
    // SHOW ON THE DATATABLES
    const requests = await requestSchema.find();

    if (udata && requests.length > 0) {
      // Authentication successful, redirect to dashboard or send success response
      req.session.user = udata; // its for storing userinfo in sessions
      res.render("gateData_table", { udata, requests });
    } else {
      // Authentication failed, redirect to login page with error message
      res.send("Invalid empid or Password");
    }
  } catch (error) {
    // Handle any errors
    console.error("Error during login:", error);
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

app.get("/logout_coordinator", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/coordinator_login"); // Redirect to login page after logout
    }
  });
});

app.get("/logout_stu_dashboard", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/"); // Redirect to login page after logout
    }
  });
});

app.get("/coordinator", (req, res) => {
  res.render("coordinator_reg");
});

app.get("/coordinator_login", (req, res) => {
  res.render("coordinator_login.ejs");
});

app.post("/coordinator", async (req, res) => {
  try {
    const data = await coordinatorSchema.create(req.body);
    console.log("Form data saved:", data);
    res.send("Form submitted successfully!");
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send(`An error occurred while processing your request.${err}`);
  }
});

// app.post("/coordinator_login", async(req,res)=>{
//     const { empid, password } = req.body;
//     try{
//     const udata = await coordinatorSchema.findOne({empid , password})

//     // WE TAKE THIS LINE OF CODE IT HELPS US TO FETCH NAME AND INFORMATION USED TO
//     // SHOW ON THE DATATABLES
//     const requests = await requestSchema.find();

//     if (udata, requests) {
//           // Authentication successful, redirect to dashboard or send success response
//           req.session.user = udata; // its for storing userinfo in sessions
//           res.render('datatable',{udata,requests});
//     }else{
//          // Authentication failed, redirect to login page with error message
//          res.send('Invalid empid or Password');
//     }
// }catch (error) {
//     // Handle any errors
//     console.error('Error during login:', error);
//     res.status(500).send(`Internal Server Error ${error}`);
// }
// })

app.post("/coordinator_login", async (req, res) => {
  const { empid, password } = req.body;
  try {
    const udata = await coordinatorSchema.findOne({ empid, password });
    const requests = await requestSchema.find();

    if (udata && requests.length > 0) {
      // Check if both udata and requests are valid
      req.session.user = udata; // Store userinfo in session
      res.render("datatable", { udata, requests });
    } else {
      res.send("Invalid empid or Password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.post("/registration", async (req, res) => {
  try {
    const data = await registrationSchema.create(req.body);
    console.log("Form data saved:", data);
    res.send("Form submitted successfully!");
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send(`An error occurred while processing your request.${err}`);
  }
});

app.post("/login", async (req, res) => {
  const { rollno, password } = req.body;
  try {
    const udata = await registrationSchema.findOne({ rollno, password });

    // WE TAKE THIS LINE OF CODE IT HELPS US TO FETCH NAME AND INFORMATION USED TO
    // SHOW ON THE DATATABLES
    const requests = await requestSchema.find();

    if ((udata, requests)) {
      // Authentication successful, redirect to dashboard or send success response
      req.session.user = udata; // its for storing userinfo in sessions
      res.render("stu_dashboard", { udata, requests });
    } else {
      // Authentication failed, redirect to login page with error message
      res.send("Invalid Roll No or Password");
    }
  } catch (error) {
    // Handle any errors
    console.error("Error during login:", error);
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

app.get("userinfo", async (req, res) => {
  const rdata = await registrationSchema.find();
  res.send(rdata);
});

// app.get('/showRequests', async (req, res) => {
//     try {
//         const requests = await requestSchema.find(); // Fetch all requests from the database
//         res.render("datatable", { requests }); // Pass requests data to the EJS template
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// -------yaha se-------

app.get("/showRequests", async (req, res) => {
  try {
    const requests = await requestSchema.find(); // Fetch all requests from the database
    const rdata = await registrationSchema.find();

    res.render("datatable", { requests }); // Pass requests data to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

app.post("/acceptLeaveRequest", async (req, res) => {
  try {
    const {email ,requestId} = req.body; // Get the request ID from the form data
     // Get the request ID from the form data
    const newStatus = "Approved"; // New status value
console.log(email)
    const transporter = nodeMailer.createTransport({
      service: process.env.EMAIL_HOST,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Approvel Of Request",
      text: `Your request is approved.` ,
    };

    // Update the document's status by ID
    const updatedRequest = await requestSchema.findByIdAndUpdate(
      requestId,
      { status: newStatus },
      { new: true }
    );

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error sending email");
        } else {
          console.log(`Email sent: ${info.response}`);
          res.status(200).json("Email sent successfully");
        }
      });

    //   --------------------------------exp-email-------------------------

    //   --------------------------------exp-email-------------------------

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    return res.redirect("/showRequests"); // Redirect to the homepage or any other page after updating
  } catch (error) {
    console.error("Error updating request:", error);
    return res.status(500).json({ error: `Internal server error :${error}` });
  }
});

// app.post('/acceptLeaveRequest', async (req, res) => {
//     const requestId = req.body.requestId;

//     try {
//         // Find the corresponding data item in the database and delete it
//         const newStatus = 'approved';
//         await requestSchema.findByIdAndUpdate(requestId, { status: newStatus }, { new: true });

//         // Send a success response back to the client
//         res.status(200).send('LEave request aprooved  succefully ');
//     } catch (error) {
//         // Handle errors
//         console.error('Error rejecting leave request:', error);
//         res.status(500).send(`Internal Server Error${error} `);
//     }
// });

app.post("/rejectLeaveRequest", async (req, res) => {
  const requestId = req.body.requestId;

  try {
    // Find the corresponding data item in the database and delete it
    await requestSchema.findByIdAndDelete(requestId);

    // Send a success response back to the client
    // res.status(200).send('request rejected sucessfully');
    return res.redirect("/showRequests"); // Redirect to the homepage or any other page after updating
  } catch (error) {
    // Handle errors
    console.error("Error rejecting leave request:", error);
    res.status(500).send(`Internal Server Error${error} `);
  }
});

app.get("/studentdashbord", isLoggedIn, (req, res) => {
  res.render("studentdashbord");
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.post("/stu_dashboard", async (req, res) => {
  try {
    // Retrieve user information from the session
    const { fname, lname, rollno, email } = req.session.user;

    // Combine user information with form data
    const leaveRequestData = {
      fname,
      lname,
      rollno,
      email,
      ...req.body, // Add other form fields
    };

    // Create a new leave request document with combined data
    const data = await requestSchema.create(leaveRequestData);
    console.log("Leave Application submitted successfully:", data);
    res.send("Leave submission successfully accomplished!");
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send(`An error occurred while processing your request.${err}`);
  }
});

// Handle POST request to update status
// app.post('/showRequests', async (req, res) => {
//     const { id, status } = req.body;

//     try {
//         await requestSchema.findByIdAndUpdate(id, { status });
//         res.redirect('/showRequests'); // Redirect back to your EJS page
//     } catch (err) {
//         console.error(`Error updating document:${err}`);
//         res.status(500).send(`Error updating document: ${err}`);
//     }
// });

// app.post("/updateStatus", async (req, res) => {
//     try {
//         const { requestId, status } = req.body;

//         // Find the request by ID and update its status
//         await requestSchema.findByIdAndUpdate(requestId, { status });

//         // Send a success response
//         res.status(200).send("Status updated successfully");
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).send(`An error occurred while processing your request.${err}`);
//     }
// });

// app.get("/showRequests", async (req, res) => {
//     try {
//         const data = await requestSchema.create(req.body);
//         console.log("Form data saved:", data);
//         res.send("Form submitted successfully!");
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).send(`An error occurred while processing your request.${err}`);
//     }
// });

// app.post("/stu_dashboard", async (req, res) => {

//     try {
//         const data = await requestSchema.create(req.body);
//         console.log()
//         console.log("Leave Application submitted sucessfully:", data);
//         res.send("Leave submission successfully Acomplished!");
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).send(`An error occurred while processing your request.${err}`);
//     }
// });

// 0-----------------------------

app.get("/gatemanverif", async (req, res) => {
  try {
    const requests = await requestSchema.find(); // Fetch all requests from the database
    const rdata = await registrationSchema.find();

    res.render("gateData_table", { requests }); // Pass requests data to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error ${error}`);
  }
});
