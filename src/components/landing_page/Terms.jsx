const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-8 text-gray-300">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">
        Welcome to CodeShard! By using our collaborative code editor, you agree
        to the following terms and conditions:
      </p>

      <h2 className="text-xl font-semibold">1. User Responsibilities</h2>
      <p className="mb-4">
        You are responsible for all content you create, edit, or share. Please
        ensure you have the necessary rights for any code you upload.
      </p>

      <h2 className="text-xl font-semibold">2. Collaboration and Data</h2>
      <p className="mb-4">
        Collaborations are public or private depending on room settings.
        CodeShard is not responsible for any shared data in public rooms.
      </p>

      <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
      <p className="mb-4">
        CodeShard respects your intellectual property rights. Ensure that your
        contributions comply with relevant laws and respect others’ rights.
      </p>

      <h2 className="text-xl font-semibold">4. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your access if you violate
        these terms or any applicable laws.
      </p>

      <p className="mt-8">Thank you for using CodeShard!</p>
    </div>
  );
};

export default TermsAndConditions;
