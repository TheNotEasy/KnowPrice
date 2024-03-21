import {HomeCollection} from "@/utils/Api/interface.ts";

export function getHomeCollections(): { "collections": HomeCollection[] } {
  const getItems = () => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        name: "Lorem Ipsum",
        rating: 4.3,
      })
    }

    return items
  }

  return {
    "collections": [
      { title: "Поблизости", shops: getItems(), type: "near" },
      { title: "Избранные", shops: getItems(), type: "fav" },
      { title: "Недавние", shops: getItems(), type: "recent" }
    ]
  }
}
