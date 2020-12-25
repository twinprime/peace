import GameMap from "../src/GameMap"
import GameObject from "../src/GameObject"

class MockGameObject extends GameObject {
  constructor(public owner: number,
    public x1: number, public x2: number, 
    public y1: number, public y2: number,
    public width: number, public height: number) {
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

test("update", () => {
  const map = new GameMap(100, 10)
  const obj1 = new MockGameObject(1, 8, 12, 0, 5, 4, 5)
  map.add(obj1)
  const obj2 = new MockGameObject(1, 10, 15, 0, 5, 5, 5)
  map.add(obj2)
  const obj3 = new MockGameObject(1, 45, 48, 0, 5, 3, 5)
  map.add(obj3)

  let result = map.getObjectsWithin(1, 1, 9)
  expect(result.size).toBe(1)
  expect(result.has(obj1)).toBeTruthy

  obj2.x1 = 5
  obj2.x2 = 10

  obj3.x1 = 8
  obj3.x2 = 11

  map.update(100000, 0)
  result = map.getObjectsWithin(1, 1, 9)
  expect(result.size).toBe(3)
  expect(result.has(obj1)).toBeTruthy
  expect(result.has(obj2)).toBeTruthy
  expect(result.has(obj3)).toBeTruthy
})