import { expect } from "@playwright/test"

export class Checkout {
   constructor(page) {
      this.page = page

      this.basketCards = page.locator('[data-qa="basket-card"]')
      this.basketItemPrice = page.locator('[data-qa="basket-item-price"]')
      this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]')
      this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]')
   }
 
    removeCheapestProduct = async() => {
        await this.basketCards.first().waitFor() // check that they exist by checking the first one
        await this.basketItemPrice.first().waitFor()  // check that they exist by checking the first one
        
        const numOfItemsBeforeRemoval = await this.basketCards.count()

        const allPriceText = await this.basketItemPrice.allInnerTexts() // allInnerTexts returns an array of innerText that correspond to the array of elements 
        const prices = allPriceText.map(price => parseInt(price.replace('$', ''), 10))
        const cheapestPrice = Math.min(...prices)

        const smallestPriceIndex = prices.indexOf(cheapestPrice)
        const specificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIndex)

        await specificRemoveButton.waitFor()
        await specificRemoveButton.click()

        await expect(this.basketCards).toHaveCount(numOfItemsBeforeRemoval - 1)

        // await this.page.pause()
    }

    continueToCheckout = async () => {
        await this.continueToCheckoutButton.waitFor()
        await this.continueToCheckoutButton.click()
        await this.page.waitForURL(/\/login/, { timeout: 3000 })

    }
}