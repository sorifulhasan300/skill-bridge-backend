import { Router } from "express";
import { CategoryController } from "./category.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();
router.post("/", middleware(UserRole.ADMIN), CategoryController.createCategory);
router.patch(
  "/:id/update",
  middleware(UserRole.ADMIN),
  CategoryController.updateCategory,
);

router.get(
  "/",

  CategoryController.getCategories,
);
router.delete(
  "/:id",
  middleware(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const categoryRouter = router;
