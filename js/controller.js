+function($, feather) {

	var controllerPrototype = {
			
		inViewport: function (item) {

			return ($(window).height() + $(window).scrollTop()) > $(item).offset().top 
				&& $(window).scrollTop() < ($(item).offset().top + $(item).height());
		
		},

		menuItemClickHandler: function (e) {

			var target = $(e.target).attr("href").replace("#", "");

			if (target.length) {

				var scrollToSection = function() {

					$("html,body").animate({

						"scrollTop": $("[name=" + target + "]").offset().top
					
					}, 500, function() {
					
						location.hash = "#" + target;

						$(e.target).addClass("current");

					});

				};

				if ($("#header .menu-toggle").is(":visible")) {

					$("#header .menu-wrapper").css("height", "0");

					setTimeout(function() {

						scrollToSection();
					
					}, 300);

				}
				else {

					scrollToSection();

				}
				
				e.preventDefault();

			}

			return this;

		},

		menuToggleClickHandler: function (e) {

			if ($("#header .menu-wrapper").height() > 0) {

				$(this).removeClass("current");

				$("#header .menu-wrapper").css("height", "0");

			}
			else {

				var height = $("#header .menu-wrapper ul.menu").height() + 
					$("#header .menu-wrapper ul.social-media").height() + 10;

				$(this).addClass("current");

				$("#header .menu-wrapper").css("height", height + "px");

			}

		},

		toggleAlternateMenu: function () {

			if (this.inViewport($("#video-wrapper"))) {

				$("#header.alternate").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", 
					function(e) {

						$(this).removeClass("alternate").removeClass("invisible");

					});

				$("#header.alternate").addClass("invisible");

			}
			else if ($("#header.alternate").length < 1) {

				$("#header").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", 
					function(e) {

						$(this).addClass("alternate").removeClass("invisible");

					});

				
				$("#header").addClass("invisible");

			}

			return this;

		},

		checkHiddenImages: function () {
			var self = this;

			$("img.invisible").each(function(i, item) {

				if (self.inViewport(this)) {

					var img = new Image();

					img.src = $(item).data("src");

					img.onload = function() {

						$(item).attr("src", this.src);

						$(item).removeClass("invisible");
					
					};

				}

			});

			return this;

		},

		scrollStartHandler: function () {

			this.toggleAlternateMenu().checkHiddenImages();

			if ($("#header .menu-wrapper").height() > 0) {

				$("#header .menu-wrapper").css("height", "0");

			}

		},

		scrollEndHandler: function () {

			this.toggleAlternateMenu().checkHiddenImages();

		},

		resizeHandler: function () {

			this.toggleAlternateMenu().checkHiddenImages();

		},

		init: function () {

			$(".menu-toggle").on("click", this.menuToggleClickHandler);

			// Try to play video and fade in
			// if playable.
			setTimeout(function() {

				$("video")
					.on("canplay", function (e) {

						$(this).css("opacity", "1.0");

						// Need DOM element to play()
						$(this)[0].play();

					}).attr("preload", "auto");

			}, 1000);

			// Append click handlers
			$("a[href^='#']").on("click", this.menuItemClickHandler);

			// Add handler for resize- and scroll-events.
			var resizable = Rx.Observable.fromEvent($(window), "resize");
			var scrollable = Rx.Observable.fromEvent($(window), "scroll");
			var self = this;

			resizable
				.throttle(300)
				.subscribe(function() {

					self.resizeHandler();

				});

			scrollable
				.throttle(300)
				.subscribe(function() {

					self.scrollEndHandler();

				});

			scrollable
				.throttleFirst(1000)
				.subscribe(function() {

					self.scrollStartHandler();

				});

			$("form[name='contact']").submit(function(e) {

				e.preventDefault();

				var self = $(this);

				self.find("input[type='submit']").attr("disabled", "disabled");

				try {

					var email = $.trim(self.find("input[name='_replyto']").val());
					var name = $.trim(self.find("input[name='name']").val());
					var message = $.trim(self.find("textarea[name='message']").val());
					var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

					if (!re.test(email)) {

						self.find("input[name='_replyto'].tooltip").tooltipster("show");

						self.find("input[name='_replyto'].tooltip").on("keypress", function() {

							self.find("input[name='_replyto'].tooltip").tooltipster("hide");

						});

						self.find("input[type='submit']").removeAttr("disabled");

						return false;

					}

					if (message === "") {

						self.find("textarea[name='message'].tooltip").tooltipster("show");

						self.find("textarea[name='message'].tooltip").on("keypress", function() {

							self.find("textarea[name='message'].tooltip").tooltipster("hide");

						});

						self.find("input[type='submit']").removeAttr("disabled");

						return false;

					}

				}
				catch (err) {

					if (typeof console === "object") {

						console.log(err.message);

					}

				}

				$.ajax({

				    url: "//formspree.io/melgrondahl@gmail.com", 
				    method: "POST",
				    data: {"_replyto": email, "name": name, "message": message},
				    dataType: "json"

				}).done(function(data) {

					$("#contact .form-wrapper").on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(e) {

						self.find("input[type='submit']").removeAttr("disabled");

						$("#contact .thank-you-message").show();

						setTimeout(function() { $("#contact .thank-you-message").removeClass("invisible"); }, 50);

						$(this).off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");

					});

					$("#contact .form-wrapper").addClass("invisible");

				});
			
			});

			$(".tooltip").tooltipster({trigger: "custom", theme: "tooltipster-punk"});

			return this;
		}

	};

	feather.controller = function controller(options) {

		return Object.create(controllerPrototype, options).init();

	};

}(jQuery, window.feather = window.feather || {});