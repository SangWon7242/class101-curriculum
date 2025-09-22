$(document).ready(function () {
  // Mobile menu toggle
  $("#mobile-menu-btn").click(function () {
    const mobileMenu = $("#mobile-menu");
    const menuBtn = $(this);

    mobileMenu.toggleClass("active");
    menuBtn.toggleClass("active");

    // Change icon
    const icon = menuBtn.find("i");
    if (mobileMenu.hasClass("active")) {
      icon.removeClass("fa-bars").addClass("fa-times");
    } else {
      icon.removeClass("fa-times").addClass("fa-bars");
    }
  });

  // Smooth scrolling for navigation links - Using native scrollIntoView
  $('a[href^="#section-"]').click(function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Close mobile menu if open
      $("#mobile-menu").removeClass("active");
      $("#mobile-menu-btn").removeClass("active");
      $("#mobile-menu-btn i").removeClass("fa-times").addClass("fa-bars");

      // Use native smooth scrolling
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update active states
      updateActiveNavigation(this.getAttribute("href"));
    }
  });

  // Throttled scroll handler for better performance
  let scrollTimeout;
  $(window).scroll(function () {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(function () {
      const scrollTop = $(window).scrollTop();
      const headerHeight = $(".top-bar").outerHeight();

      // Add scrolled class to header
      if (scrollTop > 50) {
        $(".top-bar").addClass("scrolled");
      } else {
        $(".top-bar").removeClass("scrolled");
      }

      // Show/hide back to top button
      if (scrollTop > 300) {
        $("#back-to-top").parent().fadeIn();
      } else {
        $("#back-to-top").parent().fadeOut();
      }

      // Update active navigation with improved performance
      updateActiveNavigationOnScroll(scrollTop, headerHeight);
    }, 10); // Throttle to 10ms for smooth performance
  });

  // Optimized active navigation update function
  function updateActiveNavigationOnScroll(scrollTop, headerHeight) {
    let currentSection = "";
    const sections = $('section[id^="section-"]');

    sections.each(function () {
      const sectionTop = $(this).offset().top - headerHeight - 50;
      const sectionHeight = $(this).outerHeight();
      const sectionBottom = sectionTop + sectionHeight;

      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        currentSection = "#" + $(this).attr("id");
        return false; // Break the loop once found
      }
    });

    if (currentSection) {
      updateActiveNavigation(currentSection);
    }
  }

  // Update active navigation function
  function updateActiveNavigation(activeHref) {
    // Remove active class from all nav links
    $(".nav-link, .mobile-nav-link").removeClass("active");

    // Add active class to current nav links
    $(
      `.nav-link[href="${activeHref}"], .mobile-nav-link[href="${activeHref}"]`
    ).addClass("active");
  }

  // Close mobile menu when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest("#mobile-menu, #mobile-menu-btn").length) {
      $("#mobile-menu").removeClass("active");
      $("#mobile-menu-btn").removeClass("active");
      $("#mobile-menu-btn i").removeClass("fa-times").addClass("fa-bars");
    }
  });

  // Prevent mobile menu from closing when clicking inside it
  $("#mobile-menu").click(function (e) {
    e.stopPropagation();
  });

  // Initialize active navigation on page load
  const hash = window.location.hash;
  if (hash && $(hash).length) {
    setTimeout(function () {
      updateActiveNavigation(hash);
      // Use native scrolling for initial load too
      const targetElement = document.getElementById(hash.substring(1));
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  } else {
    // Default to first section
    updateActiveNavigation("#section-1");
  }

  // Optimized hover animation for navigation links
  $(".nav-link, .mobile-nav-link").hover(
    function () {
      $(this).find("i").addClass("fa-spin");
    },
    function () {
      $(this).find("i").removeClass("fa-spin");
    }
  );

  // Intersection Observer for better performance (optional enhancement)
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = "#" + entry.target.id;
          updateActiveNavigation(sectionId);
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section[id^="section-"]').forEach((section) => {
      observer.observe(section);
    });
  }

  // Back to Top Button functionality
  $("#back-to-top").click(function () {
    // Use native smooth scrolling to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Update navigation to first section
    updateActiveNavigation("#section-1");
  });
});
