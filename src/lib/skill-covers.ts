import "server-only";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/*
  Живые обложки скилов.

  Лежат в public/skill-covers и подхватываются по имени файла:
  grafika-director.mp4 → обложка скила grafika-director. Списка в коде
  нет — как у обложек направлений: положил файл, обложка появилась.
  Иначе загрузка ролика требовала бы ещё и правки кода, а забытая
  строчка выглядела бы как «видео не загрузилось».

  Рядом с роликом кладётся картинка с тем же именем — первый кадр. Она
  показывается, пока видео не началось, и остаётся насовсем у того, кто
  выключил анимацию в системе: пустой чёрный прямоугольник вместо
  обложки читается как сломанная картинка.

  Обложка есть не у каждого скила и не должна быть: ролик надо снять, а
  скилов два десятка. Поэтому отсутствие файла — обычное дело, а не
  повод для ошибки.
*/

const DIR = join(process.cwd(), "public", "skill-covers");

/*
  Только mp4. Webm сжимает лучше, но Safari на iPhone играет его через
  раз, а больше половины заходов — с телефона. Два файла ради одного
  ролика — это два файла, которые разъедутся.
*/
const VIDEO = "mp4";
const POSTER = ["jpg", "jpeg", "png", "webp"];

export interface SkillCover {
  /** Путь к ролику: «/skill-covers/имя.mp4». */
  video: string;
  /** Первый кадр. Может не быть — тогда до запуска видно пустоту. */
  poster?: string;
}

function readCovers(): Record<string, SkillCover> {
  if (!existsSync(DIR)) return {};

  const videos: Record<string, string> = {};
  const posters: Record<string, string> = {};

  for (const file of readdirSync(DIR)) {
    const dot = file.lastIndexOf(".");
    if (dot <= 0) continue;

    const name = file.slice(0, dot);
    const ext = file.slice(dot + 1).toLowerCase();

    if (ext === VIDEO) videos[name] = `/skill-covers/${file}`;
    else if (POSTER.includes(ext)) posters[name] ??= `/skill-covers/${file}`;
  }

  const covers: Record<string, SkillCover> = {};
  for (const [name, video] of Object.entries(videos)) {
    covers[name] = { video, poster: posters[name] };
  }
  return covers;
}

const COVERS = readCovers();

/** Обложка скила или undefined, если ролика для него нет. */
export function skillCover(id: string): SkillCover | undefined {
  return COVERS[id];
}

/** Все найденные обложки — для проверок. */
export const SKILL_COVER_PATHS = Object.values(COVERS).flatMap((cover) =>
  cover.poster ? [cover.video, cover.poster] : [cover.video],
);
