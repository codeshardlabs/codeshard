import SandpackEditor from "@/src/components/editor/SandpackEditor";
import { templates } from "@/src/lib/utils";
import { redirect } from "next/navigation";
export const generateMetadata = ({ params }) => {
  let template = params.template;
  if (!templates.includes(template)) {
    console.log("Template not valid: ", template);
    console.log("Supported Options: ", templates.join(", "));
    redirect("/");
  }
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
