import { expect } from "@playwright/test"

export class PaymentPage {
   constructor(page) {
      this.page = page
      // locate ifreame and select element withn it
      this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                              .locator('[data-qa="discount-code"]')

      this.discountInput = page.getByPlaceholder('Discount code')
      this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
      this.totalValue = page.locator('[data-qa="total-value"]')
      this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
      this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')
      
      // Credit card details form
      this.creditCardOwnerInput = page.getByPlaceholder('Credit card owner')
      this.creditcardNumber = page.getByPlaceholder('Credit card number')
      this.creditcardValidUntil = page.getByPlaceholder('Valid until')
      this.creditcardCVC = page.getByPlaceholder('Credit card CVC')
      
      this.payButton = page.locator('[data-qa="pay-button"]')
   }

   activateDiscount = async () => {
    await this.discountCode.waitFor()
    const code = await this.discountCode.innerText()

/**Option 1: for laggy inputs using .fill() with await expect() */
    await this.discountInput.waitFor()
    // Need to fill out the discount input
    await this.discountInput.fill(code)
    // wait to see that the input contains the value that was entered 
    await expect(this.discountInput).toHaveValue(code) // await expect has built in retries


/**Option 2: for laggy inputs where slow typing is required*/
    // await this.discountInput.focus()
    // await this.page.keyboard.type(code, { delay: 1000 })
    // expect(await this.discountInput.inputValue()).toBe(code)
    

    expect(await this.discountedValue.isVisible()).toBe(false)
    expect(await this.discountActiveMessage.isVisible()).toBe(false)

    await this.activateDiscountButton.waitFor()
    await this.activateDiscountButton.click()

    // check that it displays "Discount activated"
    await this.discountActiveMessage.waitFor()

    // check that there is a discounted total price showing
    await this.discountedValue.waitFor()

    // check that the discounted price total is smaller than the regular one

    const discountedValueText = await this.discountedValue.innerText()
    const discountedValue = parseInt(discountedValueText.replace('$', ''), 10)

    const totalValueText = await this.totalValue.innerText()
    const totalValue = parseInt(totalValueText.replace('$', ''), 10)

    expect(discountedValue).toBeLessThan(totalValue)
    expect(this.discountedValue)
   }

    fillPaymentDetails = async({ owner, number, validUntil, cvc }) => {
        await this.creditCardOwnerInput.waitFor()
        await this.creditCardOwnerInput.fill(owner)

        await this.creditcardNumber.waitFor()
        await this.creditcardNumber.fill(number)

        await this.creditcardValidUntil.waitFor()
        await this.creditcardValidUntil.fill(validUntil)

        await this.creditcardCVC.waitFor()
        await this.creditcardCVC.fill(cvc) 
   }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()

        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
        await this.page.pause()
   }
}