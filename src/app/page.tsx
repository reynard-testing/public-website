import LinkButton from "@/components/LinkButton";
import ShadedBackground from "@/components/ShadedBackground";
import GithubIcon from "../../public/icons/github.svg";
import PaperIcon from "../../public/icons/paper.svg";
import ReynardLogo from "../../public/logos/reynard-logo.svg";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center h-full justify-center p-4 lg:p-8">
        <div className="flex flex-col items-center gap-2">
          <div>
            <ReynardLogo
              role="img"
              aria-label="Reynard Logo"
              className="w-16 h-16 md:w-24 md:h-24 lg:h-32 lg:w-32 select-none"
            />
          </div>
          <div className="text-white font-bold text-3xl md:text-5xl lg:text-6xl tracking-wide">
            Reynard
          </div>
        </div>
        <div className="text-secondary max-w-sm lg:max-w-md text-center text-lg lg:text-2xl font-medium my-12">
          Automated Fault Injection Testing for Microservice Applications
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <LinkButton
            href="https://github.com/reynard-testing/reynard"
            variant="secondary"
            icon={
              <GithubIcon
                role="img"
                aria-label="GitHub"
                className="w-full h-full"
              />
            }
          >
            View on GitHub
          </LinkButton>
          <LinkButton
            href="https://dl.acm.org/doi/10.1145/3744916.3773193"
            variant="secondary"
            icon={
              <PaperIcon
                role="img"
                aria-label="Paper"
                className="w-full h-full p-1"
              />
            }
          >
            Read the paper
          </LinkButton>
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-primary-alt-2">
        <ShadedBackground />
      </div>
    </div>
  );
}
