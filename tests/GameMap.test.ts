import GameMap from "../src/GameMap"
import GameObject from "../src/GameObject"

class MockGameObject extends GameObject {
  constructor(readonly owner: number,
              readonly x1: number, readonly x2: number, 
              readonly y1: number, readonly y2: number,
              readonly width: number, readonly height: number) {
    super(undefined, owner)
  }
}

test("getObjectsWithin", () => {
  const map = new GameMap(100, 10)
  const obj1 = new MockGameObject(1, 8, 12, 0, 5, 4, 5)
  map.add(obj1)
  const obj2 = new MockGameObject(1, 10, 15, 0, 5, 5, 5)
  map.add(obj2)
  const obj3 = new MockGameObject(1, 45, 48, 0, 5, 3, 5)
  map.add(obj3)

  let result = map.getObjectsWithin(1, 3, 8)
  expect(result.size).toBe(1)
  expect(result.has(obj1)).toBeTruthy

  result = map.getObjectsWithin(1, 5, 15)
  expect(result.size).toBe(2)
  expect(result.has(obj1)).toBeTruthy
  expect(result.has(obj2)).toBeTruthy

  result = map.getObjectsWithin(1, 13, 15)
  expect(result.size).toBe(1)
  expect(result.has(obj2)).toBeTruthy

  result = map.getObjectsWithin(1, 18, 45)
  expect(result.size).toBe(1)
  expect(result.has(obj3)).toBeTruthy

  result = map.getObjectsWithin(1, 3, 45, obj => obj.x1 >= 10)
  expect(result.size).toBe(2)
  expect(result.has(obj2)).toBeTruthy
  expect(result.has(obj3)).toBeTruthy
})