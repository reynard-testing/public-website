import LinkButton from "@/components/LinkButton";
import ShadedBackground from "@/components/ShadedBackground";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center h-full justify-center p-4 lg:p-8">
        <div className="flex flex-col items-center gap-2">
          <div>
            <Image
              src="./logos/reynard-logo.svg"
              alt="Reynard Logo"
              width={128}
              height={128}
              className="object-contain text-white w-16 h-16 md:w-24 md:h-24 lg:h-32 lg:w-32 select-none"
            />
          </div>
          <div className="text-white font-bold text-3xl md:text-5xl lg:text-6xl tracking-wide">
            Reynard
          </div>
        </div>
        <div className="text-secondary max-w-sm lg:max-w-md text-center text-lg lg:text-2xl font-medium my-12">
          Automated Fault Injection Testing for Microservice Applications
        </div>
        <div>
          <LinkButton
            href="https://github.com/reynard-testing/reynard"
            variant="secondary"
            icon={
              <Image
                src="./icons/github.svg"
                alt="github"
                width={24}
                height={24}
                className="object-contain w-full h-full text-white"
              />
            }
          >
            GitHub
          </LinkButton>
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-primary-alt-2">
        <ShadedBackground />
      </div>
    </div>
  );
}
