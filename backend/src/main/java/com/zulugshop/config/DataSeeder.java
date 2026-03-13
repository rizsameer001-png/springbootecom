package com.zulugshop.config;

import com.zulugshop.model.Category;
import com.zulugshop.model.Product;
import com.zulugshop.model.User;
import com.zulugshop.repository.CategoryRepository;
import com.zulugshop.repository.ProductRepository;
import com.zulugshop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

//import com.zulugshop.repository.CategoryRepository;
//import com.zulugshop.repository.ProductRepository;
//import com.zulugshop.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedCategories();
        seedProducts();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@zulugshop.com")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("ZuluG")
                    .email("admin@zulugshop.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of("ROLE_USER", "ROLE_ADMIN"))
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@zulugshop.com / admin123");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                Category.builder().name("Electronics").slug("electronics").description("Gadgets and devices").sortOrder(1).build(),
                Category.builder().name("Fashion").slug("fashion").description("Clothing and accessories").sortOrder(2).build(),
                Category.builder().name("Home & Living").slug("home-living").description("Furniture and decor").sortOrder(3).build(),
                Category.builder().name("Sports").slug("sports").description("Sports equipment").sortOrder(4).build(),
                Category.builder().name("Books").slug("books").description("Books and stationery").sortOrder(5).build()
            );
            categoryRepository.saveAll(categories);
            log.info("Categories seeded");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Category> categories = categoryRepository.findAll();
            if (categories.isEmpty()) return;

            String elecId = categories.stream().filter(c -> c.getSlug().equals("electronics")).findFirst().map(Category::getId).orElse(categories.get(0).getId());
            String fashId = categories.stream().filter(c -> c.getSlug().equals("fashion")).findFirst().map(Category::getId).orElse(categories.get(0).getId());

            List<Product> products = List.of(
                Product.builder()
                    .name("Premium Wireless Headphones")
                    .description("High-quality audio with active noise cancellation, 30-hour battery life and premium comfort design.")
                    .price(BigDecimal.valueOf(199.99))
                    .comparePrice(BigDecimal.valueOf(249.99))
                    .stock(50)
                    .categoryId(elecId)
                    .categoryName("Electronics")
                    .images(List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"))
                    .tags(List.of("audio", "wireless", "headphones"))
                    .featured(true)
                    .rating(4.8)
                    .reviewCount(124)
                    .build(),
                Product.builder()
                    .name("Smart Watch Pro")
                    .description("Track your fitness, receive notifications and more with this sleek smartwatch.")
                    .price(BigDecimal.valueOf(299.99))
                    .comparePrice(BigDecimal.valueOf(399.99))
                    .stock(30)
                    .categoryId(elecId)
                    .categoryName("Electronics")
                    .images(List.of("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"))
                    .tags(List.of("smartwatch", "fitness", "wearable"))
                    .featured(true)
                    .rating(4.6)
                    .reviewCount(87)
                    .build(),
                Product.builder()
                    .name("Casual Linen Shirt")
                    .description("Breathable linen fabric, perfect for warm weather. Available in multiple colors.")
                    .price(BigDecimal.valueOf(45.99))
                    .comparePrice(BigDecimal.valueOf(65.99))
                    .stock(100)
                    .categoryId(fashId)
                    .categoryName("Fashion")
                    .images(List.of("https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500"))
                    .tags(List.of("shirt", "linen", "casual"))
                    .featured(false)
                    .rating(4.3)
                    .reviewCount(42)
                    .build(),
                Product.builder()
                    .name("Mechanical Keyboard RGB")
                    .description("Tactile typing experience with customizable RGB backlighting and durable mechanical switches.")
                    .price(BigDecimal.valueOf(129.99))
                    .stock(25)
                    .categoryId(elecId)
                    .categoryName("Electronics")
                    .images(List.of("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"))
                    .tags(List.of("keyboard", "mechanical", "gaming"))
                    .featured(true)
                    .rating(4.7)
                    .reviewCount(213)
                    .build()
            );
            productRepository.saveAll(products);
            log.info("Sample products seeded");
        }
    }
}
