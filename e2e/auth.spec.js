import { test, expect } from '@playwright/test';

test.describe('Авторизація користувача', () => {
  test('успішний вхід з правильними даними', async ({ page }) => {
    // 1. Переходимо на сторінку входу
    await page.goto('/login');

    // 2. Заповнюємо форму
    await page.getByLabel(/Email/i).fill('anna@estate.dev');
    await page.getByLabel(/Пароль/i).fill('craft2026');
    
    // 3. Натискаємо кнопку входу
    await page.getByRole('button', { name: /УВІЙТИ/i }).click();

    // 4. Перевіряємо, що нас перенаправило на сторінку профілю
    await expect(page).toHaveURL(/.*profile/);
    
    // 5. Перевіряємо, що в шапці з'явилося ім'я користувача (шукаємо саме посилання)
    await expect(page.getByRole('link', { name: 'Анна Мельник' })).toBeVisible();
    
    // 6. Перевіряємо, що на сторінці профілю є email
    await expect(page.getByText('anna@estate.dev')).toBeVisible();
  });

  test('помилка при неправильному паролі', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/Email/i).fill('anna@estate.dev');
    await page.getByLabel(/Пароль/i).fill('wrongpassword');
    await page.getByRole('button', { name: /УВІЙТИ/i }).click();

    // Перевіряємо, що з'явилася помилка
    await expect(page.getByRole('alert')).toContainText('Невірний email або пароль');
  });
});
