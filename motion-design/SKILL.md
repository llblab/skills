---
name: motion-design
description: Design purposeful motion for films, product launches, explainers, animated sequences and interface transitions. Owns story, choreography, pacing and audiovisual coherence, independent of source format or rendering engine. Use for motion direction, storyboards, animatics, motion polish and finished films; compose with interface-design and renderer-specific guidance for implementation and validation.
---

# Motion Design

Make movement communicate: what changes, why it changes, and where the viewer should look next. Build a specific experience for the subject, not a template with replaceable words. The requested result may be a finished film, an animatic, a motion study or a usable interface transition; deliver that stage, not an unsolicited production package.

## Scope and Composition

This skill owns narrative over time, visual continuity, choreography, pacing, reading time and the relationship between action and sound. It does not own a rendering stack, a universal aesthetic or the surrounding application's behavior.

Compose by responsibility, not by making one skill override another:

- **Brief and references**: The user's outcome, existing product, brand, supplied references and delivery constraints shape the direction. Distinguish hard requirements from examples and defaults. Do not silently redesign a product to make its film easier to animate.
- **Interface design**: For actual pages, components, players or controls, use the applicable interface-design guidance for information architecture, semantic structure, states, responsive layout, keyboard access, focus, performance and the design system. This skill adds meaningful transitions without weakening that UX floor. HTML used only as a frame renderer is not automatically a new application to design.
- **Rendering and media**: Use the chosen engine's applicable skill and documentation for setup, APIs, animation primitives, media ownership, preview, audio, export, diagnostics and test policy. Describe the intended effect here; implement it through supported native capabilities. Do not copy a browser pipeline into a Rust project, hand-roll an existing animation runtime or route around an engine restriction with external processing.
- **Shared decisions**: Reuse the same brief, visual tokens, assets, timing and accepted direction across responsibilities. Keep the project's native source authoritative; do not maintain a parallel hand-synced schedule or duplicate approval process.

An engine default, a style recipe and an interface convention apply to their own scope; none is universal authority over the others. When a real requirement cannot be met within the chosen stack or applicable constraints, state the exact conflict and the closest supported result. Continue only with an unaffected useful subset; do not silently switch engines, weaken the brief or invent a workaround.

### Implementation Independence

Honor an explicitly requested stack. Otherwise reuse a suitable existing project or choose the simplest available stack that meets the brief. HTML/browser rendering, fframes/Rust and other suitable engines are implementation choices, not required stages of one pipeline.

Build one native source project. No HTML wrapper, browser approval page, second implementation or fixed file count is required. Planning artifacts may be Markdown with images, a contact sheet, HTML, PDF, a native preview or another inspectable format.

## 1. Frame the Work

Inspect the relevant source, project instructions, brand, references, screenshots, footage and audio before asking for material already present. Preserve the existing direction and behavior for targeted changes.

Establish only what affects this task:

- **Outcome**: What should the viewer understand, feel, decide or do afterward? For an interface, which state change or action must become clearer?
- **Audience and setting**: Prior knowledge, language, viewing size, platform, sound-on or sound-off, and whether the experience is watched or operated.
- **Scope and stage**: New work or revision; concept, preview, animatic, implementation or final export; approximate duration when relevant.
- **Constraints**: Brand, factual claims, assets and rights, reference fidelity, stack, performance, accessibility and requested output specifications.

Ask one compact question set for missing information that changes the outcome or blocks safe execution. Make reversible creative choices when the brief permits them and record material assumptions in the existing project notes. No mandatory asset count, music supplier, brand-name shape or questionnaire.

## 2. Shape One Idea

Settle the one idea before polishing. Write the governing question in the viewer's words and choose the smallest accurate visual model that answers it.

- Separate must-know information from a cut list. Do not animate the cut list.
- Find a subject-specific hook: a recognizable problem, useful contrast, revealing action, question or unexpected result. Do not invent a misconception just to manufacture a twist.
- Prefer real product behavior, real examples and sourced data. A metaphor is useful only if it improves understanding without distorting the subject.
- Use names only where the viewer needs them; use one name consistently for each thing.
- Match the emotional register and visual language to the subject. Preserve an established product identity instead of replacing it with a fashionable film aesthetic.

When the direction is open and expensive to reverse, compare a few genuinely different compositions or motion ideas with the cheapest useful evidence: sketches, representative frames or a short motion study. Choose one and explain why. Do not generate alternatives for a settled direction.

For substantial new work, prove the hardest visual or timing assumption before the full build. Show that evidence at a requested approval gate. Do not add an approval stop when the direction is already accepted or execution is authorized.

## 3. Plan the Sequence

Scale planning to the change. A revised transition may need one timing note; a new film needs a scene map and a rough timing pass.

For each scene or transition, capture:

- **Purpose**: The one addition to understanding, feeling or task clarity.
- **Timing**: Start, duration and important cues in the engine's native timing model; beats only when they are useful.
- **Composition**: Focal element, hierarchy, words and relevant states.
- **Action**: Starting state, key action, response, reading or recovery interval, and ending state.
- **Continuity**: What persists, changes or hands attention to the next idea.
- **Sound**: Voice, music or cue when needed; silence is a valid choice.
- **Evidence**: The source of a claim or a concrete observation that shows the scene works.

Make this map the basis of the native timeline, scene definitions or event/state transitions, not a second timing database. Derive related animation, footage, audio and caption cues from the same timings. Respect the engine's scene-local timing and overlap semantics rather than forcing everything into one global object.

For music- or voice-led work, choose or measure the real audio before locking timing. Align meaningful actions with phrases, transients and pauses; not every beat needs an event. For interactive motion, user action and system state set timing, not a soundtrack.

## 4. Choreograph Attention

- **Meaning before activity**: Use movement to reveal order, grouping, causality, scale, state or material. If an effect does not improve communication or a deliberate emotional beat, remove it.
- **One primary focus**: Give the eye a clear path. Secondary motion supports the focal action rather than competing with it. Avoid whole-frame beat spam and motion added merely to prevent stillness.
- **Continuity with purpose**: Carry an object, position, color, direction or idea across a transition when that helps orientation. Morphs, cuts, dissolves and still holds are tools; choose from the brief and references, not a universal ban list.
- **Readable timing**: Budget time for recognition, reading and inference at the real viewing size. Keep the camera and critical text stable while they are read. A complex diagram may need a longer hold; do not shorten it to satisfy an arbitrary beat grid.
- **Intentional motion character**: Coordinate easing, mass, speed, overshoot and stagger. Use a restrained family of motion behaviors with meaningful variation, not the same entrance for every element. Use the engine's native animation facilities.
- **Coherent geometry**: Check intermediate shapes, masks, clipping, contact points, transform origins, bounds and occlusion. Correct endpoints do not prove a correct transition.
- **Interface continuity**: Keep input responsive, feedback timely and focus/state intact. Motion must not delay an action or be the only way to understand its result. Do not force film pacing or camera tricks onto an operated interface.

Tempo, duration, aspect ratio, frame rate, dimensions, typeface, material and 2D/3D treatment come from the brief and implementation context. Numeric guidance is a starting point unless the task makes it an acceptance requirement.

## 5. Integrate Words, Sound and Access

### Words and Factual Integrity

Use short, plain, specific copy and visual explanation before paragraphs. Limit simultaneous reading load; do not impose a universal word count. On-screen anchors need not repeat narration verbatim, but captions must faithfully represent speech.

Never invent metrics, testimonials, product capabilities or factual-looking proof. Trace material claims, asset provenance and usage rights in the project's existing notes or a compact source record. Mark illustrative UI/data as illustrative; do not mistake a staged cursor animation for implemented functionality.

### Sound

Use sound when it serves the brief. Music, voice, recorded effects, authorized generated audio or silence are choices, not required ingredients. Confirm usage rights and any necessary voice/likeness permission.

Give important actions a deliberate sonic relationship without sounding every decorative movement. Protect speech intelligibility, duck competing audio where appropriate and avoid distracting cue density. Set and measure loudness and true-peak targets for the delivery context through the engine's supported audio workflow; do not assume one target fits every medium. An interface must remain operable with sound off and respect playback controls and autoplay constraints.

### Accessibility

- Keep essential text, diagrams and captions legible with sufficient contrast; do not rely on color alone. On real interfaces, preserve applicable semantic, keyboard and focus requirements, and keep labels, data and states understandable without animation.
- For films with speech, provide accurate synchronized captions in the format required by the channel, and a transcript when needed. Burn-in versus a separate track depends on delivery; captions are not required to duplicate every label in a silent motion study.
- Avoid flashing and assess applicable flash thresholds; counting flashes alone is not a complete safety check. Avoid unnecessary full-field motion and disorienting camera travel.
- For interactive experiences, respect reduced-motion preferences without hiding state changes or breaking flows. For rendered films, assess the need for a lower-motion alternative or static equivalent with the audience and channel; do not automatically export an unrequested alternate cut.
- Check legibility at the actual delivery size and keep captions and critical content clear of platform overlays and safe-area obstructions.

## 6. Build and Review Through the Native Workflow

For rendered media, make visual sampling reproducible from timeline time/frame, assets and configuration without relying on prior playback, wall-clock timers or accumulated simulation. Resolve media and fonts before compositing the relevant frame. Use native frame sampling and media synchronization rather than reproducing another stack's APIs. This requirement does not replace an application's event-driven state model.

For interactive UI, preserve native layout, state, lifecycle and input behavior. Use the interface implementation guidance for CSS/JavaScript choices and performance; do not impose per-frame JavaScript on normal controls to imitate a film renderer.

Review with the chosen implementation's supported preview, frames, contact sheets, diagnostics and audio tools. Follow its required checks and test policy; visual artifact inspection does not imply creating a snapshot suite or test harness, nor does it waive required application checks.

Keep iteration proportional: inspect the changed range plus enough lead-in and follow-through to judge its transition; broaden when sequence, timing, audio or layout dependencies change. Prefer native preview to repeated full encodes. A preview request is not a request for final export; an explicit final-export request does not need another confirmation. Follow the engine's preview-launch and review handoff procedure.

### Evidence to Collect

Choose the evidence that covers the task and the applicable implementation requirements:

- **Composition and comprehension**: Inspect representative frames or rendered UI at the actual viewing size. Use a contact sheet for sequence-level hierarchy, continuity and pacing.
- **Motion integrity**: Inspect entrances, exits, boundaries and intermediate geometry for pops, clipping and accidental discontinuities. Use native diagnostics where available; inspect warnings rather than treating every deliberate cut or blink as a defect.
- **Timing and synchronization**: Check reading intervals and align picture, voice, captions and cues. For seekable rendered media, spot-check stable frame sampling when relevant to the change, without inventing a regression harness.
- **Sound**: Measure levels when audio is present. Review muted playback and audio-only playback when those facilities are available; measurements alone do not prove a listening review.
- **Operability**: For real interfaces, exercise the primary path, affected states, viewport/content extremes and reduced motion using the interface-design workflow.
- **Final media**: After a requested export, check the actual file's dimensions, frame rate, duration, streams and required encoding properties, not just the project settings.

Record what was actually run or inspected and what remains unverified. Do not claim to have watched, listened, measured or passed an independent review without evidence. Use independent review when it materially helps and is available; do not make a subagent a universal dependency. Retain focused before/after evidence for significant fixes when useful, not a mandatory frame pair for every edit.

## 7. Deliver the Requested Stage

For a finished-film request, the deliverable is the encoded film, not just a storyboard, source file or still. Include the native source project, required assets or retrieval instructions, dependency information and reproducible export commands. Existing projects keep their established organization; no separate source bundle is needed merely for a revision.

For preview, animatic or interface work, deliver the corresponding preview, motion study or working implementation with a concrete way to inspect it. Do not force a video export or film documentation package onto a component change.

Ship the requested or agreed aspects, resolutions and alternative versions, plus accessibility outputs required for the delivery context. Recompose when another aspect needs a different hierarchy or camera path; a blind crop is not a substitute for checking the composition. Keep source, licensing, decisions and verification records in the smallest useful existing artifact set. No mandatory `directions.html`, JSON token file, SRT for silent work or fixed output filenames.

Report the chosen direction, delivered paths or surface, how to preview or reproduce it, checks actually run and remaining limits. Stop when the requested stage is evidenced; do not expand into extra formats, full renders or redesigns without a task reason.

## Optional Creative Recipes

Recipes are starting points, not the default identity of every film. Use one only when requested or supported by the brief and references. They do not override product/interface requirements, renderer constraints, accessibility or the requested scope.

- **Continuous product launch**: For a deliberately seamless, object-led keynote treatment, read [the launch recipe](references/keynote-launch.md). Do not select it merely because the subject is a product.
- **Explanatory model**: Question or recognizable situation → smallest accurate model → real example → changed variable or contrast → payoff and next step. Let evidence and audience needs set the proportions. A twist, music drop, cursor or looping ending is optional.
- **Other directions**: Derive the form from the subject and references. A kinetic-typography piece, documentary edit, restrained technical explanation or functional UI transition need not imitate either recipe.
