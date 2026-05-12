package com.ttn.sporttn.modules.category.repository;

import java.util.List;
import java.util.Optional;

import com.ttn.sporttn.modules.category.dto.response.CategoryAdminResponse;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ttn.sporttn.modules.category.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Find category by name
     */
    Optional<Category> findByName(String name);

    List<Category> findTop10ByParentSlugAndActiveTrueOrderByDisplayOrderAsc(
            String parentSlug
    );

    List<Category> findTop12ByParentIsNullAndActiveTrueOrderByDisplayOrderAsc();

    /**
     * Find all active categories with pagination
     */
    Page<Category> findByActiveTrue(Pageable pageable);

    List<Category> findByParentIsNullAndActiveTrueOrderByDisplayOrderAsc();

    // Category cha — hiện sections trên home
    List<Category> findByParentIsNullAndShowOnHomeTrueAndActiveTrueOrderByDisplayOrderAsc();


    List<Category> findByParentIdAndActiveTrueOrderByDisplayOrderAsc(Long parentId);

    @Query("SELECT c.id as categoryId, c.slug as slug, p.name as parent, " +
            "COUNT(prod.id) as productCount, c.displayOrder as displayOrder, " +
            "c.showOnHome as showOnHome, c.active as active " +
            "FROM Category c " +
            "LEFT JOIN c.parent p " +
            "LEFT JOIN Product prod ON prod.category.id = c.id " +
            "GROUP BY c.id, c.slug, p.name, c.displayOrder, c.showOnHome, c.active")
    Page<CategoryAdminResponse> findAllForAdmin(Pageable pageable);

    @Query("SELECT c.id as categoryId, c.name as name,c.slug as slug, c.imageUrl as imageUrl," +
            "c.sectionTitle as sectionTitle, p.id as parentId, p.name as parentName, " +
            "COUNT(prod.id) as productCount, c.displayOrder as displayOrder, " +
            "c.showOnHome as showOnHome, c.active as active " +
            "FROM Category c " +
            "LEFT JOIN c.parent p " +
            "LEFT JOIN Product prod ON prod.category.id = c.id " +
            "GROUP BY c.id, c.name, c.slug, c.sectionTitle, c.imageUrl, p.id, p.name, c.displayOrder, c.showOnHome, c.active")
    List<CategoryAdminResponse> findAllForAdmin();

    Optional<Category> findBySlug(@NotBlank(message = "Slug không được để trống") String slug);

    @Query("SELECT MAX(c.displayOrder) FROM Category c")
    Integer findMaxDisplayOrder();

    boolean existsByParentId(Long id);
}
