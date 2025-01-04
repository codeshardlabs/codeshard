import SandpackEditor from "@/components/SandpackEditor";
import { templates } from "@/src/utils";
import { redirect } from "next/navigation";
export const generateMetadata = ({ params }) => {
  let template = params.template;
  if (!templates.includes(template)) {
    // TODO: Give Error Info. to user using modal or alert.
    console.log("Template not valid: ", template);
    console.log("Supported Options: ", templates.join(", "));
    redirect("/");
  }

  // My implementation:
  // template = template.toLowerCase();
  // template = template.split("");
  // template[0] = template[0].toUpperCase();
  // template = template.join("");

  // ChatGPT:
  template = template.charAt(0).toUpperCase() + template.slice(1).toLowerCase();
  return {
    title: `${template} Template`,
  };
};

export default function templatePage({ params }) {
  const template = params.template;
  return (
    <>
      <SandpackEditor template={template} shard={false} />
    </>
  );
}
