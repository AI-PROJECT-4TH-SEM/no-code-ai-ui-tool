import Navbar from "@/components/Navbar"

const sections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you use UI_Changer-AI, we may collect information you provide directly, such as your name, email address, account credentials, HTML or URLs submitted for analysis, saved themes, and messages sent to the assistant.",
      "We also collect limited technical information needed to operate and secure the service, including authentication tokens, session details, approximate usage activity, browser information, and error logs.",
    ],
  },
  {
    title: "2. How We Use Information",
    paragraphs: [
      "We use your information to provide, personalize, maintain, and improve UI_Changer-AI. This includes analyzing submitted website markup, generating design suggestions, saving your sessions and themes, responding to support requests, and authenticating your account.",
      "We may also use aggregated or de-identified information to understand product performance, prevent abuse, and improve our features. We do not use your private account content to advertise to you.",
    ],
  },
  {
    title: "3. Website Content and AI Processing",
    paragraphs: [
      "When you submit HTML, a URL, or an instruction, that content is processed to perform the requested analysis or transformation. Do not submit passwords, payment information, private keys, or other sensitive personal information in website content or chat messages.",
      "Some features may use third-party AI or infrastructure providers to process requests. Those providers receive only the information required to provide the relevant feature and are expected to protect it according to their terms and policies.",
    ],
  },
  {
    title: "4. Sharing Information",
    paragraphs: [
      "We do not sell your personal information. We may share information with service providers that host our database, deliver email, provide AI processing, monitor reliability, or help us operate the service.",
      "We may disclose information when required by law, to protect the security of the service, to investigate fraud or abuse, or in connection with a merger, acquisition, or other business transfer.",
    ],
  },
  {
    title: "5. Data Retention and Deletion",
    paragraphs: [
      "We retain account information and saved sessions for as long as needed to provide the service, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated personal information through the support channel in the application.",
      "Some information may remain in backups for a limited period before it is securely overwritten.",
    ],
  },
  {
    title: "6. Cookies and Local Storage",
    paragraphs: [
      "UI_Changer-AI uses cookies, browser storage, or similar technologies to keep you signed in, maintain session security, remember preferences, and support essential functionality. You can control cookies through your browser settings, but disabling essential storage may prevent parts of the service from working.",
    ],
  },
  {
    title: "7. Security",
    paragraphs: [
      "We use reasonable technical and organizational safeguards to protect information against unauthorized access, alteration, disclosure, or destruction. No internet service is completely secure, so please use a unique password and keep your account credentials confidential.",
    ],
  },
  {
    title: "8. Your Choices and Rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, export, restrict, or delete your personal information, or to object to certain processing. To make a request, contact the UI_Changer-AI team through the support channel in the application. We may need to verify your identity before completing a request.",
    ],
  },
  {
    title: "9. Children’s Privacy",
    paragraphs: [
      "UI_Changer-AI is not intended for children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, please contact us so we can remove it.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy as the service changes. When we make material changes, we will update the date below and, where appropriate, provide additional notice. Your continued use of UI_Changer-AI after an update means you acknowledge the revised policy.",
    ],
  },
]

const navigation = sections.map((section) => ({
  label: section.title.replace(/^\d+\. /, ""),
  id: section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
}))

export const metadata = {
  title: "Privacy Policy | UI_Changer-AI",
  description: "Privacy Policy for UI_Changer-AI.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#08090d] text-gray-200">
      <Navbar />

      <header className="relative overflow-hidden border-b border-white/10 bg-[#0b1118]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.2),transparent_25%),radial-gradient(circle_at_12%_85%,rgba(6,182,212,0.16),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              <span className="h-px w-10 bg-cyan-400" />
              Trust & transparency
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Privacy, made clear.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
              We built UI_Changer-AI to make web design simpler. This policy explains, in plain language, what happens to your information while you use it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
              <span>UI_Changer-AI</span>
              <span className="h-1 w-1 rounded-full bg-pink-400" />
              <span>Effective September 12, 2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-[220px_minmax(0,720px)] md:px-10 md:py-20">
        <aside className="md:pt-2">
          <div className="md:sticky md:top-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">On this page</p>
            <nav className="mt-5 flex gap-3 overflow-x-auto pb-2 md:block md:space-y-1 md:overflow-visible md:pb-0" aria-label="Privacy policy sections">
              {navigation.map((item, index) => (
                <a key={item.id} href={`#${item.id}`} className="block shrink-0 whitespace-nowrap border-l border-white/10 px-3 py-2 text-xs text-gray-500 transition hover:border-pink-400 hover:text-white md:whitespace-normal">
                  <span className="mr-2 text-gray-700">{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0">
          <div className="border-b border-white/10 pb-10">
            <p className="max-w-2xl text-lg leading-8 text-gray-300">
              Your trust matters to us. We collect only what helps us provide, secure, and improve the product, and we never sell your personal information.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="border-l-2 border-cyan-400/70 pl-4">
                <p className="text-sm font-semibold text-white">Clear by design</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Straightforward explanations, without legal fog.</p>
              </div>
              <div className="border-l-2 border-pink-400/70 pl-4">
                <p className="text-sm font-semibold text-white">No selling data</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Your personal information is not an advertising product.</p>
              </div>
              <div className="border-l-2 border-purple-400/70 pl-4">
                <p className="text-sm font-semibold text-white">You stay in control</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Ask to access, correct, export, or delete your data.</p>
              </div>
            </div>
          </div>

          <div className="space-y-12 pt-10">
            {sections.map((section, index) => {
              const id = navigation[index].id
              return (
              <section id={id} key={section.title} className="scroll-mt-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-pink-400">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{section.title.replace(/^\d+\. /, "")}</h2>
                </div>
              <div className="mt-4 space-y-4 text-base leading-8 text-gray-400">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              </section>
              )
            })}

            <section className="border-t border-white/10 pt-10">
              <div className="border border-white/10 bg-white/3 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Have a question?</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Talk to the person behind the product.</h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-gray-400">
                  For privacy questions or requests, email <a href="mailto:riteshjha689@gmail.com" className="text-pink-300 transition hover:text-pink-200">riteshjha689@gmail.com</a> or connect on <a href="https://www.linkedin.com/in/ritesh-jha-436a54346/" target="_blank" rel="noreferrer" className="text-cyan-300 transition hover:text-cyan-200">LinkedIn</a>.
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  )
}
