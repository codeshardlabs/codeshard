const PrivacyPolicy = () => {
  const list = [
    {
      header: "Information Collection",
      description: "We collect personal information like email addresses when users sign up. We may also collect usage data for improving the platform."
    },
    {
      header: "Use of Information",
      description: "Your information is used to provide and improve our services. We do not sell your data to third parties."
    }, 
    {
      header: "Data Security",
      description: " We implement security measures to protect your data from unauthorized access. However, no method of transmission over the internet is 100% secure."
    }, 
    {
      header: "Third-Party Services",
      description: "We may use third-party services for analytics or authentication, which have their own privacy policies."
    }
  ]
  return (
    <div className="container mx-auto p-8 text-gray-300">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At CodeShard, we prioritize your privacy. This privacy policy outlines
        how we collect, use, and safeguard your information.
      </p>

      {
        list.map((item,index) => (<Fragment key={index}>
          <h2 className="text-xl font-semibold">{index+1}{". "}{item.header}</h2>
          <p className="mb-4">{item.description}</p>
        </Fragment>))
      }
    
      <p className="mt-8">
        For more details, feel free to contact us at codeshardofficial@gmail.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;
