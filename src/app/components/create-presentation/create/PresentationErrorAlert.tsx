// "use client";

// import React from "react";
// import { Alert, AlertTitle, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const FE_URL = process.env.NEXT_PUBLIC_FE_URL || "";

// interface PresentationErrorAlertProps {
//   error: string;
//   onClose: () => void;
// }

// const PresentationErrorAlert: React.FC<PresentationErrorAlertProps> = ({
//   error,
//   onClose,
// }) => {
//   const renderMessage = () => {
//     if (!error) return null;

//     switch (error) {
//       /** 🔹 Trial errors */
//       case "TRIAL_EXPIRED":
//         return (
//           <>
//             Your <b>trial</b> has expired. Please{" "}
//             <a
//               href={`${FE_URL}/pricing`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 fontWeight: 600,
//                 textDecoration: "underline",
//               }}
//             >
//               upgrade
//             </a>{" "}
//             to continue.
//           </>
//         );

//       case "TRIAL_LIMIT_REACHED":
//         return (
//           <>
//             You’ve reached today’s <b>trial</b> deck limit. Please try again
//             tomorrow, or{" "}
//             <a
//               href={`${FE_URL}/pricing`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 fontWeight: 600,
//                 textDecoration: "underline",
//               }}
//             >
//               upgrade
//             </a>{" "}
//             to get the full experience .
//           </>
//         );

//       /** 🔹 Subscription errors */
//       case "NO_SUBSCRIPTION":
//         return (
//           <>
//             You don’t have an active <b>subscription</b>.{" "}
//             <a
//               href={`${FE_URL}/pricing`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 fontWeight: 600,
//                 textDecoration: "underline",
//               }}
//             >
//               Subscribe now
//             </a>{" "}
//             to continue.
//           </>
//         );

//       case "SUBSCRIPTION_EXPIRED":
//       case "SUBSCRIPTION_ENDED":
//         return (
//           <>
//             Your <b>subscription</b> has expired.{" "}
//             <a
//               href={`${FE_URL}/pricing`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 fontWeight: 600,
//                 textDecoration: "underline",
//               }}
//             >
//               Renew your plan
//             </a>{" "}
//             to keep creating decks.
//           </>
//         );

//       case "SUBSCRIPTION_NOT_ACTIVE":
//         return (
//           <>
//             Your <b>subscription</b> is not yet active. Please check your
//             billing status.
//           </>
//         );

//       case "SUBSCRIPTION_LIMIT_REACHED":
//         return (
//           <>
//             You’ve reached today’s <b>deck limit</b> for your subscription plan.
//             Please try again tomorrow.
//           </>
//         );
//       case "NO_PLAN_OR_TRIAL":
//         return (
//           <>
//             Your <b>trial</b> has expired or is no longer active. Please upgrade
//             to one of our{" "}
//             <a
//               href={`${FE_URL}/pricing`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 fontWeight: 600,
//                 textDecoration: "underline",
//               }}
//             >
//               plans
//             </a>{" "}
//             to keep up the experience.
//           </>
//         );

//       /** 🔹 Fallback */
//       default:
//         return (
//           <>
//             We’re currently experiencing high demand, and your request couldn’t
//             be processed right now. Please try again in a few minutes. If the
//             issue persists, feel free to contact our support team.
//           </>
//         );
//     }
//   };

//   return (
//     <Alert
//       severity="error"
//       variant="outlined"
//       sx={{
//         mt: 3,
//         borderRadius: "12px",
//         border: "1.5px solid #f44336",
//         backgroundColor: "#fff5f5",
//         color: "#d32f2f",
//         fontWeight: 500,
//       }}
//       action={
//         <IconButton
//           aria-label="close"
//           color="inherit"
//           size="small"
//           onClick={onClose}
//         >
//           <CloseIcon fontSize="inherit" />
//         </IconButton>
//       }
//     >
//       <AlertTitle>Error</AlertTitle>
//       {renderMessage()}
//     </Alert>
//   );
// };

// export default PresentationErrorAlert;

//+++++++++++++++++++++++++++++++++++++++++
//Below is for payments not ready

"use client";

import React from "react";
import { Alert, AlertTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FE_URL = process.env.NEXT_PUBLIC_FE_URL || "";

interface PresentationErrorAlertProps {
  error: string;
  onClose: () => void;
}

const PresentationErrorAlert: React.FC<PresentationErrorAlertProps> = ({
  error,
  onClose,
}) => {
  const renderMessage = () => {
    if (!error) return null;

    switch (error) {
      /** 🔹 Trial errors */
      case "TRIAL_EXPIRED":
        return (
          <>
            Your <b>trial</b> has expired. Please join our{" "}
            <a
              href={`${FE_URL}/waiting-list`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              waiting list
            </a>{" "}
            to receive updates on our upcomming plans.
          </>
        );

      case "TRIAL_LIMIT_REACHED":
        return (
          <>
            You’ve reached today’s <b>trial</b> deck limit. Please try again
            tomorrow, you can also join our{" "}
            <a
              href={`${FE_URL}/waiting-list`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              waiting list
            </a>{" "}
            to receive updates on our upcomming plans.
          </>
        );

      /** 🔹 Subscription errors */
      case "NO_SUBSCRIPTION":
        return (
          <>
            You don’t have an active <b>subscription</b>. you can join our{" "}
            <a
              href={`${FE_URL}/waiting-list`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              waiting list
            </a>{" "}
            to receive updates on our upcomming plans.
          </>
        );

      case "SUBSCRIPTION_EXPIRED":
      case "SUBSCRIPTION_ENDED":
        return (
          <>
            Your <b>subscription</b> has expired.{" "}
            <a
              href={`${FE_URL}/pricing`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Renew your plan
            </a>{" "}
            to keep creating decks.
          </>
        );

      case "SUBSCRIPTION_NOT_ACTIVE":
        return (
          <>
            Your <b>subscription</b> is not yet active. Please check your
            billing status.
          </>
        );

      case "SUBSCRIPTION_LIMIT_REACHED":
        return (
          <>
            You’ve reached today’s <b>deck limit</b> for your subscription plan.
            Please try again tomorrow.
          </>
        );
      case "NO_PLAN_OR_TRIAL":
        return (
          <>
            Your <b>trial</b> has expired or is no longer active. Please join
            our{" "}
            <a
              href={`${FE_URL}/waiting-list`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              waiting list
            </a>{" "}
            to receive updates on our upcomming plans.
          </>
        );

      /** 🔹 Fallback */
      default:
        return (
          <>
            We’re currently experiencing high demand, and your request couldn’t
            be processed right now. Please try again in a few minutes. If the
            issue persists, feel free to contact our support team.
          </>
        );
    }
  };

  return (
    <Alert
      severity="error"
      variant="outlined"
      sx={{
        mt: 3,
        borderRadius: "12px",
        border: "1.5px solid #f44336",
        backgroundColor: "#fff5f5",
        color: "#d32f2f",
        fontWeight: 500,
      }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      <AlertTitle>Error</AlertTitle>
      {renderMessage()}
    </Alert>
  );
};

export default PresentationErrorAlert;
