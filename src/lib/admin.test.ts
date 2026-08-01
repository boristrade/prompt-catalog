import { describe, it, expect, afterEach } from "vitest";
import { isAdminEmail } from "./admin";

/*
  Допуск в админку. Ошибиться здесь можно ровно один раз — тесты
  закрепляют именно граничные случаи: пустая переменная, регистр, пробелы.
*/
describe("isAdminEmail", () => {
  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  it("переменная не задана — доступа нет ни у кого", () => {
    delete process.env.ADMIN_EMAILS;
    expect(isAdminEmail("owner@example.com")).toBe(false);
  });

  it("переменная пустой строкой — тоже закрыто", () => {
    process.env.ADMIN_EMAILS = "";
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail("owner@example.com")).toBe(false);
  });

  it("почта из списка допускается", () => {
    process.env.ADMIN_EMAILS = "owner@example.com";
    expect(isAdminEmail("owner@example.com")).toBe(true);
  });

  it("регистр и пробелы вокруг почты не мешают совпадению", () => {
    process.env.ADMIN_EMAILS = "  Owner@Example.com , second@example.com";
    expect(isAdminEmail("owner@example.com")).toBe(true);
    expect(isAdminEmail("SECOND@EXAMPLE.COM")).toBe(true);
  });

  it("почти совпавшая почта не пускает", () => {
    process.env.ADMIN_EMAILS = "owner@example.com";
    expect(isAdminEmail("owner@example.co")).toBe(false);
    expect(isAdminEmail("owner2@example.com")).toBe(false);
  });

  it("null и undefined не пускают", () => {
    process.env.ADMIN_EMAILS = "owner@example.com";
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("список из одних запятых — список пуст, доступа нет", () => {
    process.env.ADMIN_EMAILS = ",,,";
    expect(isAdminEmail("")).toBe(false);
  });
});
