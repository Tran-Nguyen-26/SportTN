package com.ttn.sporttn.modules.cms.service;

import com.ttn.sporttn.modules.cms.entity.Banner;
import com.ttn.sporttn.modules.cms.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<Banner> getBannerByPos(String pos) {
        return bannerRepository.findByPositionAndActiveTrueOrderByDisplayOrderAsc(pos);
    }
}
