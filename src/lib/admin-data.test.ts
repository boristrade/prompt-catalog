import { describe, it, expect } from "vitest";
import { filterUsers, hasPro, statsOf, type AdminUser } from "./admin-data";

function user(overrides: Partial<AdminUser> = {}): AdminUser {
  return {
    id: "1",
    email: "person@example.com",
    name: "",
    createdAt: new Date().toISOString(),
    proUntil: null,
    endless: false,
    paymentCode: "AAAA1111",
    favorites: 0,
    ...overrides,
  };
}

describe("hasPro", () => {
  it("бессрочный доступ — всегда PRO", () => {
    expect(hasPro(user({ endless: true, proUntil: null }))).toBe(true);
  });

  it("дата окончания в будущем — PRO", () => {
    const future = new Date(Date.now() + 86400000);
    expect(hasPro(user({ proUntil: future }))).toBe(true);
  });

  it("дата окончания в прошлом — уже не PRO", () => {
    const past = new Date(Date.now() - 86400000);
    expect(hasPro(user({ proUntil: past }))).toBe(false);
  });

  it("доступ не покупался — не PRO", () => {
    expect(hasPro(user({ proUntil: null }))).toBe(false);
  });
});

describe("filterUsers", () => {
  const list = [
    user({ id: "1", email: "aixten092@gmail.com", name: "AI XteN", paymentCode: "18A588A6" }),
    user({ id: "2", email: "anna.designer@example.com", name: "", paymentCode: "7F3C09BE" }),
    user({ id: "3", email: "other@example.com", name: "Пётр", paymentCode: "CC41D0A2" }),
  ];

  it("пустой запрос возвращает всех", () => {
    expect(filterUsers(list, "")).toEqual(list);
    expect(filterUsers(list, "   ")).toEqual(list);
  });

  it("находит по части почты, без учёта регистра", () => {
    expect(filterUsers(list, "AIXTEN")).toEqual([list[0]]);
  });

  it("находит по коду платежа", () => {
    expect(filterUsers(list, "7f3c09be")).toEqual([list[1]]);
  });

  it("находит по имени", () => {
    expect(filterUsers(list, "пётр")).toEqual([list[2]]);
  });

  it("ничего не подошло — пустой список, а не ошибка", () => {
    expect(filterUsers(list, "нет такого")).toEqual([]);
  });
});

describe("statsOf", () => {
  it("считает пользователей, PRO, бессрочных и избранное", () => {
    const list = [
      user({ endless: true, favorites: 3 }),
      user({ proUntil: new Date(Date.now() + 86400000), favorites: 2 }),
      user({ proUntil: new Date(Date.now() - 86400000), favorites: 1 }),
      user({ favorites: 0 }),
    ];
    expect(statsOf(list)).toEqual({
      total: 4,
      pro: 2,
      endless: 1,
      favorites: 6,
    });
  });

  it("пустой список — нули, а не падение", () => {
    expect(statsOf([])).toEqual({ total: 0, pro: 0, endless: 0, favorites: 0 });
  });
});
