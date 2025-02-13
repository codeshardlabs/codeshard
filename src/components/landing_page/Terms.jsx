import { Fragment } from "react";

const TermsAndConditions = () => {
  const list = [
    {
    header: "User Responsibilities",
    description: "You are responsible for all content you create, edit, or share. Please ensure you have the necessary rights for any code you upload."
  },
  {
    header: "Collaboration and Data",
    description: "Collaborations are public or private depending on room settings. CodeShard is not responsible for any shared data in public rooms."
  },
  {
    header: "Intellectual Property",
    description: "CodeShard respects your intellectual property rights. Ensure that your contributions comply with relevant laws and respect others&apos; rights."
  },
  {
    header: "Termination",
    description: "We reserve the right to suspend or terminate your access if you violate these terms or any applicable laws."
  }
]
  return (
    <div className="container mx-auto p-8 text-gray-300">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">
        Welcome to CodeShard! By using our collaborative code editor, you agree
        to the following terms and conditions:
      </p>
      {
        list.map((item, index) => (<Fragment index={index}>
          <h2 className="text-xl font-semibold">{index+ 1}{". "}{item.header}</h2>
          <p className="mb-4">{item.description}</p>
        </Fragment>))
      }
      <p className="mt-8">Thank you for using CodeShard!</p>
    </div>
  );
};

export default TermsAndConditions;
