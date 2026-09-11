import React from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  Info,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import type { LegalScreenStrings } from '../i18n/types.landing';

const LegalHeader = ({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <header className="border-b border-zinc-200 pb-7">
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center border border-zinc-200 bg-zinc-50">
          {icon}
        </div>

        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          {eyebrow}
        </span>
      </div>

      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-300">
        THESDEL
      </span>
    </div>

    <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
      {title}
    </h1>

    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
      {description}
    </p>
  </header>
);

const LegalSection = ({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) => (
  <section className="grid gap-3 sm:grid-cols-[72px_1fr] sm:gap-5">
    <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">
      {number}
    </div>

    <div>
      <h2 className="text-sm font-bold tracking-tight text-zinc-950">
        {title}
      </h2>

      <div className="mt-2 text-sm leading-6 text-zinc-500">
        {body}
      </div>
    </div>
  </section>
);

const LegalShell = ({
  id,
  children,
  footerLabel,
  buttonLabel,
  onBack,
}: {
  id: string;
  children: React.ReactNode;
  footerLabel: string;
  buttonLabel: string;
  onBack: () => void;
}) => (
  <section
    id={id}
    className="w-full max-w-3xl animate-fade-in"
  >
    <div className="border border-zinc-200 bg-white">
      <div className="p-6 sm:p-9">{children}</div>

      <div className="flex flex-col gap-4 border-t border-zinc-200 bg-zinc-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-9">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />

          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-400">
            {footerLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center justify-center gap-2 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {buttonLabel}
        </button>
      </div>
    </div>
  </section>
);

interface TermsScreenProps {
  strings: LegalScreenStrings;
  onReturnToSignup: () => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({
  strings,
  onReturnToSignup,
}) => {
  return (
    <LegalShell
      id="terms-screen"
      footerLabel={strings.footerLabel}
      buttonLabel={strings.buttonLabel}
      onBack={onReturnToSignup}
    >
      <LegalHeader
        eyebrow={strings.eyebrow}
        title={strings.title}
        description={strings.description}
        icon={
          <FileText className="h-4 w-4 text-zinc-700" />
        }
      />

      <div className="mt-8 space-y-8">
        {strings.effectiveDate && (
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              {strings.effectiveDateLabel}
            </span>

            <span className="font-mono text-[9px] text-zinc-500">
              {strings.effectiveDate}
            </span>
          </div>
        )}

        {strings.sections.map((section) => (
          <LegalSection
            key={section.number}
            number={section.number}
            title={section.title}
            body={section.body}
          />
        ))}
      </div>
    </LegalShell>
  );
};

interface PrivacyScreenProps {
  strings: LegalScreenStrings;
  onReturnToSignup: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  strings,
  onReturnToSignup,
}) => {
  return (
    <LegalShell
      id="privacy-screen"
      footerLabel={strings.footerLabel}
      buttonLabel={strings.buttonLabel}
      onBack={onReturnToSignup}
    >
      <LegalHeader
        eyebrow={strings.eyebrow}
        title={strings.title}
        description={strings.description}
        icon={
          <LockKeyhole className="h-4 w-4 text-zinc-700" />
        }
      />

      <div className="mt-8 space-y-8">
        {strings.effectiveDate && (
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              {strings.effectiveDateLabel}
            </span>

            <span className="font-mono text-[9px] text-zinc-500">
              {strings.effectiveDate}
            </span>
          </div>
        )}

        {strings.sections.map((section) => (
          <LegalSection
            key={section.number}
            number={section.number}
            title={section.title}
            body={section.body}
          />
        ))}
      </div>
    </LegalShell>
  );
};

interface AboutScreenProps {
  strings: LegalScreenStrings;
  onReturnToLanding: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  strings,
  onReturnToLanding,
}) => {
  return (
    <LegalShell
      id="about-screen"
      footerLabel={strings.footerLabel}
      buttonLabel={strings.buttonLabel}
      onBack={onReturnToLanding}
    >
      <LegalHeader
        eyebrow={strings.eyebrow}
        title={strings.title}
        description={strings.description}
        icon={
          <Info className="h-4 w-4 text-zinc-700" />
        }
      />

      <div className="mt-8 space-y-8">
        {strings.sections.map((section) => (
          <LegalSection
            key={section.number}
            number={section.number}
            title={section.title}
            body={section.body}
          />
        ))}

        <div className="border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-zinc-950 text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-zinc-950">
                Student Digital Exchange Layer
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                A connected digital layer for the modern
                school experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LegalShell>
  );
};