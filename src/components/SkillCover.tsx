import type { SkillCover as Cover } from "@/lib/skill-covers";

/*
  Обложка скила — короткий ролик без звука, идущий по кругу.

  Обычный <video>, а не библиотека и не гиф. Гиф того же ролика весит в
  десять раз больше при худшей картинке, а библиотека тянула бы за собой
  скрипт ради тега, который и так умеет всё нужное.

  Три атрибута, без которых на телефоне это не работает вовсе:
  muted — иначе iOS не даст запустить само, playsInline — иначе он
  раскроет ролик на весь экран поверх страницы, loop — ролик короткий и
  без повтора замрёт на последнем кадре.

  Кто выключил анимацию в системе, видит первый кадр картинкой. Не
  «видео без движения», а именно картинку: остановленный <video> в
  Safari показывает пустоту, пока его не тронут пальцем.
*/

export default function SkillCover({
  cover,
  className = "",
}: {
  cover: Cover;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-line bg-sunken ${className}`}
    >
      <video
        src={cover.video}
        poster={cover.poster}
        autoPlay
        muted
        loop
        playsInline
        // Метаданные, а не весь файл: до появления на экране качать
        // полминуты видео ради обложки незачем.
        preload="metadata"
        aria-hidden
        className="aspect-video w-full object-cover motion-reduce:hidden"
      />
      {cover.poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover.poster}
          alt=""
          className="hidden aspect-video w-full object-cover motion-reduce:block"
        />
      )}
    </div>
  );
}
