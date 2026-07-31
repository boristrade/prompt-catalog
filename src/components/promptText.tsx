/*
  Общее для карточки в каталоге и страницы промта. Раньше и подсветка, и
  заглушка жили внутри PromptCard — второй экран копировал бы их, и через
  пару правок они разошлись бы.
*/

/**
 * Подсвечиваем {переменные} акцентом: сразу видно, что заменять на своё,
 * ещё до чтения текста.
 */
export function highlightVars(text: string) {
  return text.split(/(\{[^{}]*\})/g).map((part, i) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={i} className="text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/*
  Заглушка под замком. Настоящий текст закрытого промта на клиент не
  уходит вовсе — размытие это лишь картинка, и через инструменты
  разработчика его читали бы как обычный текст.
*/
export const VEIL = `Role: {specialist}, {years} years in {niche}.
Task: prepare {deliverable} for {audience}.

Context:
— channel: {channel}
— goal: {goal}
— constraints: {constraints}

Answer format:
1. {first block}
2. {second block}
3. {third block}

Tone: {tone}. Length: {length}.`;
