import assert from "node:assert/strict"
import test from "node:test"
import sharp from "sharp"
import { buildCartPrompt, cartBaseAssetNames, resolveAddOns, selectIceCreamBase, supportedCateringItems } from "./cart-ai"
import {
  compositeArtwork,
  compositeFloralArrangement,
  compositeGeneratedLayers,
  getExplicitAllowedRegions,
  getGeneratedPreviewLayers,
} from "./cart-preview"

test("ice cream defaults to the supplied white quadrant", () => {
  const selection = selectIceCreamBase()

  assert.equal(selection.fileName, "3_12C8894F-B48E-4104-B7B9-23350BD79634_1789163522459.png")
  assert.equal(selection.quadrant, "bottom-right")
  assert.equal(selection.label, "white solid")
  assert.equal(selection.matchedRoofColor, false)
})

test("ice cream uses an explicit saved roof color without inventing a color", () => {
  const yellow = selectIceCreamBase("#FFD700")
  const burgundy = selectIceCreamBase("Burgundy")

  assert.equal(yellow.quadrant, "top-left")
  assert.equal(yellow.label, "yellow-and-white striped")
  assert.equal(burgundy.quadrant, "bottom-right")
  assert.equal(burgundy.label, "burgundy solid")
  assert.equal(burgundy.matchedRoofColor, true)
})

test("prompt keeps stripe treatments on the existing roof and preserves decal fidelity", () => {
  const prompt = buildCartPrompt({
    cartType: "ice-cream",
    roofDecor: "stripe-vinyl",
    addOns: ["stripe-vinyl", "custom-decal"],
    colors: { roofColor: "#FFD700" },
    hasDecal: true,
    decalWillBeComposited: true,
  })

  assert.match(prompt, /EXISTING rigid roof/i)
  assert.match(prompt, /white plus #FFD700/i)
  assert.match(prompt, /without changing a single cart detail/i)
  assert.match(prompt, /handle, bracket, shelf, support, and item of hardware/i)
  assert.match(prompt, /exact uploaded decal will be composited once, centered/i)
  assert.match(prompt, /do not add, copy, redraw, or duplicate/i)
  assert.doesNotMatch(prompt, /paint the main cart body/i)
})

test("cart types use the approved locked base uploads", () => {
  assert.equal(cartBaseAssetNames.classic, "0_7A49DAF0-5894-4897-9B50-3B3C221004BE_1789163522459.png")
  assert.equal(cartBaseAssetNames.mobile, "1_58EFC0F0-98F2-4887-BE57-0946F2F86296_1789163522459.jpeg")
  assert.equal(selectIceCreamBase("yellow").fileName, "2_C2B73297-11EC-431E-AEA4-BFA828A8B76E_1789163522459.png")
  assert.equal(selectIceCreamBase("black").fileName, "3_12C8894F-B48E-4104-B7B9-23350BD79634_1789163522459.png")
  assert.equal(selectIceCreamBase("pink").fileName, "4_0031962D-1F24-4CC1-9CB9-015EFDEA962B_1789163522459.png")
})

test("flower catering uses the reference rack beside the selected cart, not countertop flowers", () => {
  for (const cartType of ["classic", "mobile", "ice-cream"]) {
    const prompt = buildCartPrompt({ cartType, cateringItems: ["flower", "candy"], addOns: ["stripe-vinyl"], colors: { roofColor: "purple" } })
    assert.match(prompt, /VIEWER'S RIGHT/)
    assert.match(prompt, /three-tier flower rack/)
    assert.match(prompt, /final supplied image is the flower display reference/)
    assert.match(prompt, /Arrange candy jars neatly on top/)
    assert.match(prompt, /white plus purple/)
    assert.doesNotMatch(prompt, /Arrange beautiful tropical flower arrangements/)
  }
  assert.doesNotMatch(buildCartPrompt({ cartType: "classic", cateringItems: ["candy"] }), /FLOWER CART CATERING/)
  assert.doesNotMatch(buildCartPrompt({ cartType: "classic", location: "bali", cateringItems: ["flower"] }), /FLOWER CART CATERING/)
})

test("custom catering uses the customer's text as the design brief on the selected cart counter", () => {
  assert.ok(supportedCateringItems.includes("custom-catering"))
  const prompt = buildCartPrompt({
    cartType: "classic",
    cateringItems: ["custom-catering"],
    customCateringDetails: "A lavender lemonade bar with glass dispensers and lemon slices",
  })

  assert.match(prompt, /CUSTOM CATERING DESIGN BRIEF/)
  assert.match(prompt, /lavender lemonade bar with glass dispensers and lemon slices/)
  assert.match(prompt, /selected base cart's existing countertop or serving surface/)
  assert.match(prompt, /Do not place it beside, behind, beneath, or attached to the cart/)
  assert.match(prompt, /Do not invent unrelated catering items/)
})

test("an explicit empty add-on selection cannot be re-enabled by stale legacy fields", () => {
  const input = {
    cartType: "classic",
    addOns: [],
    roofDecor: "stripe-vinyl",
    design: "floral",
    hasDecal: true,
  }
  assert.deepEqual(resolveAddOns(input), [])
  const prompt = buildCartPrompt(input)
  assert.doesNotMatch(prompt, /striped vinyl|floral accent|customer's decal/i)
})

test("florals stay out of the AI prompt while selected catering remains", () => {
  const prompt = buildCartPrompt({
    cartType: "classic",
    addOns: ["floral"],
    cateringItems: ["donut"],
  })

  assert.match(prompt, /tiered donut displays/i)
  assert.doesNotMatch(prompt, /floral|flower|greenery/i)
})

test("floral selection never becomes an AI layer, including with catering", () => {
  assert.deepEqual(
    getGeneratedPreviewLayers({ hasStripeVisual: false, hasCateringVisual: false, hasBrandingVisual: false }),
    []
  )
  assert.deepEqual(
    getGeneratedPreviewLayers({ hasStripeVisual: false, hasCateringVisual: true, hasBrandingVisual: false }),
    ["catering"]
  )
})

test("Bali keeps its existing floral model flow", () => {
  const prompt = buildCartPrompt({ cartType: "classic", location: "bali", addOns: ["floral"] })

  assert.match(prompt, /floral accent/i)
})

test("no generated layer returns the locked base byte-for-byte", async () => {
  const base = await sharp({
    create: { width: 20, height: 20, channels: 3, background: { r: 220, g: 200, b: 180 } },
  })
    .png()
    .toBuffer()
  const result = await compositeGeneratedLayers(base, base, "classic", [])

  assert.ok(result.equals(base))
})

test("generated pixels are composited only inside the selected layer mask", async () => {
  const base = await sharp({
    create: { width: 20, height: 20, channels: 3, background: { r: 220, g: 0, b: 0 } },
  })
    .png()
    .toBuffer()
  const generated = await sharp({
    create: { width: 20, height: 20, channels: 3, background: { r: 0, g: 0, b: 220 } },
  })
    .png()
    .toBuffer()
  const result = await compositeGeneratedLayers(base, generated, "classic", ["stripe"])
  const pixels = await sharp(result).raw().toBuffer()

  const at = (x: number, y: number) => {
    const offset = (y * 20 + x) * 4
    return pixels.subarray(offset, offset + 4)
  }
  assert.deepEqual([...at(0, 0).subarray(0, 3)], [220, 0, 0])
  assert.deepEqual([...at(10, 2).subarray(0, 3)], [0, 0, 220])
})

test("uploaded decal artwork is composited onto the base without regeneration", async () => {
  const base = await sharp({
    create: { width: 20, height: 20, channels: 3, background: { r: 220, g: 0, b: 0 } },
  })
    .png()
    .toBuffer()
  const artwork = await sharp({
    create: { width: 4, height: 4, channels: 3, background: { r: 0, g: 220, b: 0 } },
  })
    .png()
    .toBuffer()
  const result = await compositeArtwork(base, artwork, "classic")
  const pixels = await sharp(result).raw().toBuffer()

  const at = (x: number, y: number) => {
    const offset = (y * 20 + x) * 4
    return pixels.subarray(offset, offset + 4)
  }
  assert.deepEqual([...at(0, 0).subarray(0, 3)], [220, 0, 0])
  assert.deepEqual([...at(9, 13).subarray(0, 3)], [0, 220, 0])
})

test("the selected floral addon uses the fixed cutout and preserves the cart canvas", async () => {
  const base = await sharp({
    create: { width: 100, height: 100, channels: 3, background: { r: 220, g: 0, b: 0 } },
  })
    .png()
    .toBuffer()
  const result = await compositeFloralArrangement(base, "classic")
  const metadata = await sharp(result).metadata()

  assert.equal(metadata.width, 100)
  assert.equal(metadata.height, 100)
  assert.notDeepEqual(result, base)
})

test("preview geometry follows each supplied cart image", () => {
  const mobileRoof = getExplicitAllowedRegions("mobile", ["stripe"])[0]
  const mobileCounter = getExplicitAllowedRegions("mobile", ["catering"])[0]
  assert.deepEqual(mobileRoof.points[0], [0.138, 0.217])
  assert.deepEqual(mobileRoof.points[2], [0.827, 0.293])
  assert.deepEqual(mobileCounter.points[0], [0.2, 0.35])
  assert.deepEqual(mobileCounter.points[2], [0.83, 0.607])

  for (const quadrant of ["top-left", "top-right", "bottom-left", "bottom-right"] as const) {
    assert.equal(getExplicitAllowedRegions("ice-cream", ["stripe"], quadrant).length, 1)
    assert.equal(getExplicitAllowedRegions("ice-cream", ["catering"], quadrant).length, 1)
  }
})