package com.ttn.sporttn.modules.cms.repository;

import com.ttn.sporttn.modules.cms.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findByPositionAndActiveTrueOrderByDisplayOrderAsc(String position);


    List<Banner> findByPositionAndCategoryIdAndActiveTrueOrderByDisplayOrderAsc(String position, Long categoryId);

    List<Banner> findByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(Long categoryId);
}
