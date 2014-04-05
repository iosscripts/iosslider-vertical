/*
 * iosSlider - http://iosscripts.com/iosslider-vertical/
 * 
 * Touch Enabled, Responsive jQuery Vertical Content Slider Plugin
 *
 * iosSlider Vertical is a jQuery plugin which allows you to integrate a customizable,
 * cross-browser content slider into your web presence. Designed for containing long, 
 * scrolling vertical content.
 * 
 * Copyright (c) 2013 Marc Whitbread
 * 
 * Version: v1.0.17 (04/05/2014)
 * Minimum requirements: jQuery v1.4+
 *
 * Advanced requirements:
 * 1) jQuery bind() click event override on slide requires jQuery v1.6+
 *
 * Terms of use:
 *
 * 1) iosSlider is licensed under the Creative Commons – Attribution-NonCommercial 3.0 License.
 * 2) You may use iosSlider free for personal or non-profit purposes, without restriction.
 *	  Attribution is not required but always appreciated. For commercial projects, you
 *	  must purchase a license. You may download and play with the script before deciding to
 *	  fully implement it in your project. Making sure you are satisfied, and knowing iosSlider
 *	  is the right script for your project is paramount.
 * 3) You are not permitted to make the resources found on iosscripts.com available for
 *    distribution elsewhere "as is" without prior consent. If you would like to feature
 *    iosSlider on your site, please do not link directly to the resource zip files. Please
 *    link to the appropriate page on iosscripts.com where users can find the download.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 */

;(function($) {
	
	/* global variables */
	var scrollbarNumber = 0;
	var yScrollDistance = 0;
	var xScrollDistance = 0;
	var scrollIntervalTime = 10;
	var scrollbarDistance = 0;
	var isTouch = 'ontouchstart' in window;
	var supportsOrientationChange = 'onorientationchange' in window;
	var isWebkit = false;
	var has3DTransform = false;
	var isIe7 = false;
	var isIe8 = false;
	var isIe9 = false;
	var isIe = false;
	var isGecko = false;
	var grabOutCursor = 'pointer';
	var grabInCursor = 'pointer';
	var onChangeEventLastFired = new Array();
	var autoSlideTimeouts = new Array();
	var iosSliders = new Array();
	var iosSliderSettings = new Array();
	var isEventCleared = new Array();
	var slideTimeouts = new Array();
	var activeChildOffsets = new Array();
	var activeChildInfOffsets = new Array();
	var infiniteSliderOffset = new Array();
	var sliderMin = new Array();
	var sliderMax = new Array();
	var sliderAbsMax = new Array();
	var touchLocks = new Array();
	
	/* private functions */
	var helpers = {
    
        showScrollbar: function(settings, scrollbarClass) {
			
			if(settings.scrollbarHide) {
				$('.' + scrollbarClass).css({
					opacity: settings.scrollbarOpacity,
					filter: 'alpha(opacity:' + (settings.scrollbarOpacity * 100) + ')'
				});
			}
			
		},
		
		hideScrollbar: function(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber) {
			
			if(settings.scrollbar && settings.scrollbarHide) {
					
				for(var i = j; i < j+25; i++) {
					
					scrollTimeouts[scrollTimeouts.length] = helpers.hideScrollbarIntervalTimer(scrollIntervalTime * i, distanceOffsetArray[j], ((j + 24) - i) / 24, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber, settings);
					
				}
			
			}
			
		},
		
		hideScrollbarInterval: function(newOffset, opacity, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber, settings) {
	
			scrollbarDistance = (newOffset * -1) / (sliderMax[sliderNumber]) * (stageHeight - scrollMargin - scrollBorder - scrollbarHeight);
			
			helpers.setSliderOffset('.' + scrollbarClass, scrollbarDistance);
			
			$('.' + scrollbarClass).css({
				opacity: settings.scrollbarOpacity * opacity,
				filter: 'alpha(opacity:' + (settings.scrollbarOpacity * opacity * 100) + ')'
			});
			
		},
		
		slowScrollHorizontalInterval: function(node, slideNodes, newOffset, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, activeChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterHeights, sliderNumber, centeredSlideOffset, endOffset, settings) {
			
			if(settings.infiniteSlider) {
				
				if(newOffset <= (sliderMax[sliderNumber] * -1)) {

					var scrollerHeight = $(node).height();

					if(newOffset <= (sliderAbsMax[sliderNumber] * -1)) {

						var sum = originalOffsets[0] * -1;
						$(slideNodes).each(function(i) {
							
							helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
							if(i < childrenOffsets.length) {
								childrenOffsets[i] = sum * -1;
							}
							sum = sum + slideNodeOuterHeights[i];
							
						});
						
						newOffset = newOffset + childrenOffsets[0] * -1;
						sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;
						infiniteSliderOffset[sliderNumber] = 0;

						while((childrenOffsets[childrenOffsets.length-1] - centeredSlideOffset) >= (newOffset - stageHeight)) {
							
							var lowSlideNumber = 0;
							var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'y') < lowSlideOffset) {
									lowSlideOffset = helpers.getSliderOffset(this, 'y');
									lowSlideNumber = i;
								}
								
							});

							var tempOffset = sliderMin[sliderNumber] + scrollerHeight;
							helpers.setSliderOffset($(slideNodes)[lowSlideNumber], tempOffset);

							sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;
							
							childrenOffsets.splice(0, 1);
							childrenOffsets.splice(childrenOffsets.length, 0, tempOffset * -1 + centeredSlideOffset);

							infiniteSliderOffset[sliderNumber]++;
							activeChildOffsets[sliderNumber]--;
							
						}
						
					} else {
						
						var lowSlideNumber = 0;
						var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
						$(slideNodes).each(function(i) {
							
							if(helpers.getSliderOffset(this, 'y') < lowSlideOffset) {
								lowSlideOffset = helpers.getSliderOffset(this, 'y');
								lowSlideNumber = i;
							}
							
						});
						
						var tempOffset = sliderMin[sliderNumber] + scrollerHeight;
						helpers.setSliderOffset($(slideNodes)[lowSlideNumber], tempOffset);
						
						sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

						childrenOffsets.splice(0, 1);
						childrenOffsets.splice(childrenOffsets.length, 0, tempOffset * -1 + centeredSlideOffset);

						infiniteSliderOffset[sliderNumber]++;
						
					}
					
				}
				
				if((newOffset >= (sliderMin[sliderNumber] * -1)) || (newOffset >= 0)) {
					
					var scrollerHeight = $(node).height();

					if(newOffset >= 0) {
												
						var sum = originalOffsets[0] * -1;
						$(slideNodes).each(function(i) {

							helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
							if(i < childrenOffsets.length) {
								childrenOffsets[i] = sum * -1;
							}
							sum = sum + slideNodeOuterHeights[i];
							
						});
						
						newOffset = newOffset - childrenOffsets[0] * -1;
						sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;
						infiniteSliderOffset[sliderNumber] = numberOfSlides;

						while((childrenOffsets[0] + centeredSlideOffset) <= newOffset) {

							var highSlideNumber = 0;
							var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'y') > highSlideOffset) {
									highSlideOffset = helpers.getSliderOffset(this, 'y');
									highSlideNumber = i;
								}
								
							});

							var tempOffset = sliderMin[sliderNumber] - slideNodeOuterHeights[highSlideNumber];
							helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset);
							
							childrenOffsets.splice(0, 0, tempOffset * -1 + centeredSlideOffset);
							childrenOffsets.splice(childrenOffsets.length-1, 1);

							sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

							infiniteSliderOffset[sliderNumber]--;
							activeChildOffsets[sliderNumber]++;
							
						}

					} 
					
					if(newOffset < 0) {

						var highSlideNumber = 0;
						var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
						$(slideNodes).each(function(i) {
							
							if(helpers.getSliderOffset(this, 'y') > highSlideOffset) {
								highSlideOffset = helpers.getSliderOffset(this, 'y');
								highSlideNumber = i;
							}
							
						});						
					
						var tempOffset = sliderMin[sliderNumber] - slideNodeOuterHeights[highSlideNumber];
						helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset);
						
						childrenOffsets.splice(0, 0, tempOffset * -1 + centeredSlideOffset);
						childrenOffsets.splice(childrenOffsets.length-1, 1);

						sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

						infiniteSliderOffset[sliderNumber]--;
						
					}
				
				}
				
			}

			var slideChanged = false;
			var newChildOffset = helpers.calcActiveOffset(settings, newOffset, childrenOffsets, stageHeight, infiniteSliderOffset[sliderNumber], numberOfSlides, activeChildOffset, sliderNumber);
			var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			if(settings.infiniteSlider) {
								
				if(tempOffset != activeChildInfOffsets[sliderNumber]) slideChanged = true;
					
			} else {
			
				if(newChildOffset != activeChildOffsets[sliderNumber]) slideChanged = true;
			
			}
			
			if(slideChanged) {
				
				var args = new helpers.args('change', settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, endOffset);
				$(node).parent().data('args', args);
				
				if(settings.onSlideChange != '') {
				
					settings.onSlideChange(args);
				
				}
			
			}
			
			activeChildOffsets[sliderNumber] = newChildOffset;
			activeChildInfOffsets[sliderNumber] = tempOffset;
			
			newOffset = Math.floor(newOffset);

			helpers.setSliderOffset(node, newOffset);

			if(settings.scrollbar) {
				
				scrollbarDistance = Math.floor((newOffset * -1 - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageHeight - scrollMargin - scrollbarHeight));
				var height = scrollbarHeight - scrollBorder;
					
				if(newOffset >= (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) {

					height = scrollbarHeight - scrollBorder - (scrollbarDistance * -1);
					
					helpers.setSliderOffset($('.' + scrollbarClass), 0);
					
					$('.' + scrollbarClass).css({
						height: height + 'px'
					});
				
				} else if(newOffset <= ((sliderMax[sliderNumber] * -1) + 1)) {
					
					height = scrollbarStageHeight - scrollMargin - scrollBorder - scrollbarDistance;
					
					helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
					
					$('.' + scrollbarClass).css({
						height: height + 'px'
					});
					
				} else {
					
					helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
					
					$('.' + scrollbarClass).css({
						height: height + 'px'
					});
				
				}
				
			}
			
		},
		
		slowScrollHorizontal: function(node, slideNodes, mouseWheelScroll, scrollTimeouts, scrollbarClass, yScrollDistance, xScrollDistance, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings) {
			
			var nodeOffset = helpers.getSliderOffset(node, 'y');
			var distanceOffsetArray = new Array();
			var yScrollDistanceArray = new Array();
			var snapDirection = 0;
			var maxSlideVelocity = 25 / 1024 * stageHeight;
			var changeSlideFired = false;
			frictionCoefficient = settings.frictionCoefficient;
			elasticFrictionCoefficient = settings.elasticFrictionCoefficient;
			snapFrictionCoefficient = settings.snapFrictionCoefficient;
				
			if(((yScrollDistance > settings.snapVelocityThreshold) || ((yScrollDistance > 0) && mouseWheelScroll)) && settings.snapToChildren && !snapOverride) {
				snapDirection = 1;
			} else if(((yScrollDistance < (settings.snapVelocityThreshold * -1)) || ((yScrollDistance < 0) && mouseWheelScroll)) && settings.snapToChildren && !snapOverride) {
				snapDirection = -1;
			}
			
			if(yScrollDistance < (maxSlideVelocity * -1)) {
				yScrollDistance = maxSlideVelocity * -1;
			} else if(yScrollDistance > maxSlideVelocity) {
				yScrollDistance = maxSlideVelocity;
			}
			
			if(!($(node)[0] === $(currentEventNode)[0])) {
				snapDirection = snapDirection * -1;
				yScrollDistance = yScrollDistance * -2;
			}
			
			var tempInfiniteSliderOffset = infiniteSliderOffset[sliderNumber];
			
			if(settings.infiniteSlider) {
			
				var tempSliderMin = sliderMin[sliderNumber];
				var tempSliderMax = sliderMax[sliderNumber];
			
			}
			
			var tempChildrenOffsets = new Array();
			var tempSlideNodeOffsets = new Array();

			for(var i = 0; i < childrenOffsets.length; i++) {
				
				tempChildrenOffsets[i] = childrenOffsets[i];
				
				if(i < slideNodes.length) {
					tempSlideNodeOffsets[i] = helpers.getSliderOffset($(slideNodes[i]), 'y');
				}
				
			}

			while((yScrollDistance > 1) || (yScrollDistance < -1)) {
				
				yScrollDistance = yScrollDistance * frictionCoefficient;
				nodeOffset = nodeOffset + yScrollDistance;

				if(((nodeOffset > (sliderMin[sliderNumber] * -1)) || (nodeOffset < (sliderMax[sliderNumber] * -1))) && !settings.infiniteSlider) {
					yScrollDistance = yScrollDistance * elasticFrictionCoefficient;
					nodeOffset = nodeOffset + yScrollDistance;
				}
				
				if(settings.infiniteSlider) {
					
					if(nodeOffset <= (tempSliderMax * -1)) {

						var scrollerHeight = $(node).height();
							
						var lowSlideNumber = 0;
						var lowSlideOffset = tempSlideNodeOffsets[0];
						for(var i = 0; i < tempSlideNodeOffsets.length; i++) {
							
							if(tempSlideNodeOffsets[i] < lowSlideOffset) {
								lowSlideOffset = tempSlideNodeOffsets[i];
								lowSlideNumber = i;
							}
							
						}
						
						var newOffset = tempSliderMin + scrollerHeight;
						tempSlideNodeOffsets[lowSlideNumber] = newOffset;
						
						tempSliderMin = tempChildrenOffsets[1] * -1 + centeredSlideOffset;
						tempSliderMax = tempSliderMin + scrollerHeight - stageHeight;

						tempChildrenOffsets.splice(0, 1);
						tempChildrenOffsets.splice(tempChildrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

						tempInfiniteSliderOffset++;
						
					}
					
					if(nodeOffset >= (tempSliderMin * -1)) {
						
						var scrollerHeight = $(node).height();
						
						var highSlideNumber = 0;
						var highSlideOffset = tempSlideNodeOffsets[0];
						for(var i = 0; i < tempSlideNodeOffsets.length; i++) {
							
							if(tempSlideNodeOffsets[i] > highSlideOffset) {
								highSlideOffset = tempSlideNodeOffsets[i];
								highSlideNumber = i;
							}
							
						}

						var newOffset = tempSliderMin - slideNodeOuterHeights[highSlideNumber];
						tempSlideNodeOffsets[highSlideNumber] = newOffset;
						
						tempChildrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
						tempChildrenOffsets.splice(tempChildrenOffsets.length-1, 1);

						tempSliderMin = tempChildrenOffsets[0] * -1 + centeredSlideOffset;
						tempSliderMax = tempSliderMin + scrollerHeight - stageHeight;

						tempInfiniteSliderOffset--;

					}
						
				}

				distanceOffsetArray[distanceOffsetArray.length] = nodeOffset;
				yScrollDistanceArray[yScrollDistanceArray.length] = yScrollDistance;
				
			}

			var slideChanged = false;
			var newChildOffset = helpers.calcActiveOffset(settings, nodeOffset, tempChildrenOffsets, stageHeight, tempInfiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber);

			var tempOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides)%numberOfSlides;

			if(settings.snapToChildren) {
			
				if(settings.infiniteSlider) {
				
					if(tempOffset != activeChildInfOffsets[sliderNumber]) {
						slideChanged = true;
					}
						
				} else {
				
					if(newChildOffset != activeChildOffsets[sliderNumber]) {
						slideChanged = true;
					}
				
				}

				if((snapDirection < 0) && !slideChanged) {
				
					newChildOffset++;
					
					if((newChildOffset >= childrenOffsets.length) && !settings.infinteSlider) newChildOffset = childrenOffsets.length - 1;
					
				} else if((snapDirection > 0) && !slideChanged) {
				
					newChildOffset--;
					
					if((newChildOffset < 0) && !settings.infinteSlider) newChildOffset = 0;
					
				}
				
			}

			if(settings.snapToChildren || (((nodeOffset > (sliderMin[sliderNumber] * -1)) || (nodeOffset < (sliderMax[sliderNumber] * -1))) && !settings.infiniteSlider)) {
				
				if(((nodeOffset > (sliderMin[sliderNumber] * -1)) || (nodeOffset < (sliderMax[sliderNumber] * -1))) && !settings.infiniteSlider) {
					distanceOffsetArray.splice(0, distanceOffsetArray.length);					
				} else {
					distanceOffsetArray.splice(distanceOffsetArray.length * 0.10, distanceOffsetArray.length);
					nodeOffset = (distanceOffsetArray.length > 0) ? distanceOffsetArray[distanceOffsetArray.length-1] : nodeOffset;
				}

				while((nodeOffset < (tempChildrenOffsets[newChildOffset] - 0.5)) || (nodeOffset > (tempChildrenOffsets[newChildOffset] + 0.5))) {
					
					nodeOffset = ((nodeOffset - (tempChildrenOffsets[newChildOffset])) * snapFrictionCoefficient) + (tempChildrenOffsets[newChildOffset]);
					
					if(mouseWheelScroll) {
						
						if(!settings.infiniteSlider) {
							nodeOffset = (nodeOffset > (sliderMin[sliderNumber] * -1)) ? sliderMin[sliderNumber] * -1 : nodeOffset;
							nodeOffset = (nodeOffset < (sliderMax[sliderNumber] * -1)) ? sliderMax[sliderNumber] * -1 : nodeOffset;
						}
						
					}
					
					distanceOffsetArray[distanceOffsetArray.length] = nodeOffset;

				}
				
				distanceOffsetArray[distanceOffsetArray.length] = tempChildrenOffsets[newChildOffset];
			}

			var jStart = 1;
			if((distanceOffsetArray.length%2) != 0) {
				jStart = 0;
			}
			
			var lastTimeoutRegistered = 0;
			var count = 0;
			
			for(var j = 0; j < scrollTimeouts.length; j++) {
				clearTimeout(scrollTimeouts[j]);
			}
			
			var endOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides)%numberOfSlides;

			var lastCheckOffset = 0;
			for(var j = jStart; j < distanceOffsetArray.length; j = j + 2) {
				
				if((j == jStart) || (Math.abs(distanceOffsetArray[j] - lastCheckOffset) > 1) || (j >= (distanceOffsetArray.length - 2))) {
					
					lastCheckOffset	= distanceOffsetArray[j];
					
					scrollTimeouts[scrollTimeouts.length] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * j, node, slideNodes, distanceOffsetArray[j], scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, newChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterHeights, sliderNumber, centeredSlideOffset, endOffset, settings);
				
				}
				
			}
			
			var slideChanged = false;
			var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			if(settings.infiniteSlider) {
				
				if(tempOffset != activeChildInfOffsets[sliderNumber]) {
					slideChanged = true;
				}
					
			} else {
			
				if(newChildOffset != activeChildOffsets[sliderNumber]) {
					slideChanged = true;
				}
			
			}
				
			if((settings.onSlideComplete != '') && (distanceOffsetArray.length > 1)) { 
				
				scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (j + 1), settings, node, $(node).children(':eq(' + tempOffset + ')'), endOffset, sliderNumber);
				
			}
			
			slideTimeouts[sliderNumber] = scrollTimeouts;
			
			helpers.hideScrollbar(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber);
				
		},
		
		onSlideComplete: function(settings, node, slideNode, newChildOffset, sliderNumber) {
			
			var isChanged = (onChangeEventLastFired[sliderNumber] != newChildOffset) ? true : false;
			var args = new helpers.args('complete', settings, $(node), slideNode, newChildOffset, newChildOffset);
			$(node).parent().data('args', args);
				
			if(settings.onSlideComplete != '') {
				
				settings.onSlideComplete(args);
			
			}
			
			onChangeEventLastFired[sliderNumber] = newChildOffset;
		
		},
		
		getSliderOffset: function(node, xy) {
			
			var sliderOffset = 0;
			xy = 5;
			
			if(has3DTransform && !isIe7 && !isIe8) {
				
				var transforms = new Array('-webkit-transform', '-moz-transform', 'transform');
				
				for(var i = 0; i < transforms.length; i++) {
					
					if($(node).css(transforms[i]) != undefined) {
						
						if($(node).css(transforms[i]).length > 0) {
						
							var transformArray = $(node).css(transforms[i]).split(',');
							
							break;
							
						}
					
					}
				
				}
				
				sliderOffset = parseInt(transformArray[xy], 10);
					
			} else {
			
				sliderOffset = parseInt($(node).css('top'), 10);
			
			}

			return sliderOffset;
		
		},
		
		setSliderOffset: function(node, sliderOffset) {
			
			if(has3DTransform && !isIe7 && !isIe8) {
				
				$(node).css({
					'webkitTransform': 'matrix(1,0,0,1,0,' + sliderOffset + ')',
					'MozTransform': 'matrix(1,0,0,1,0,' + sliderOffset + ')',
					'transform': 'matrix(1,0,0,1,0,' + sliderOffset + ')'
				});
			
			} else {

				$(node).css({
					top: sliderOffset + 'px'
				});
			
			}
						
		},
		
		setBrowserInfo: function() {
			
			if(navigator.userAgent.match('WebKit') != null) {
				isWebkit = true;
				grabOutCursor = '-webkit-grab';
				grabInCursor = '-webkit-grabbing';
			} else if(navigator.userAgent.match('Gecko') != null) {
				isGecko = true;
				grabOutCursor = 'move';
				grabInCursor = '-moz-grabbing';
			} else if(navigator.userAgent.match('MSIE 7') != null) {
				isIe7 = true;
				isIe = true;
			} else if(navigator.userAgent.match('MSIE 8') != null) {
				isIe8 = true;
				isIe = true;
			} else if(navigator.userAgent.match('MSIE 9') != null) {
				isIe9 = true;
				isIe = true;
			}
			
		},
		
		has3DTransform: function() {
			
			var has3D = false;
			
			var testElement = $('<div />').css({
				'webkitTransform': 'matrix(1,1,1,1,1,1)',
				'MozTransform': 'matrix(1,1,1,1,1,1)',
				'transform': 'matrix(1,1,1,1,1,1)'
			});
			
			if(testElement.attr('style') == '') {
				has3D = false;
			} else if(isGecko && (parseInt(navigator.userAgent.split('/')[3], 10) >= 21)) {
				//bug in v21+ which does not render slides properly in 3D
				has3D = false;
			} else if(testElement.attr('style') != undefined) {
				has3D = true;
			}
			
			return has3D;
			
		},
		
		getSlideNumber: function(slide, sliderNumber, numberOfSlides) {
			
			return (slide - infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
		
		}, 

        calcActiveOffset: function(settings, offset, childrenOffsets, stageHeight, infiniteSliderOffset, numberOfSlides, activeChildOffset, sliderNumber) {

			var isFirst = false;
			var arrayOfOffsets = new Array();
			var newChildOffset;
			
			if(offset > childrenOffsets[0]) newChildOffset = 0;
			if(offset < (childrenOffsets[childrenOffsets.length-1])) newChildOffset = numberOfSlides - 1;
			
			for(var i = 0; i < childrenOffsets.length; i++) {
								
				if((childrenOffsets[i] <= offset) && (childrenOffsets[i] > (offset - stageHeight))) {
				
					if(!isFirst && (childrenOffsets[i] != offset)) {
						
						arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i-1];
						
					}
					
					arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i];
					
					isFirst = true;
						
				}
			
			}
			
			if(arrayOfOffsets.length == 0) {
				arrayOfOffsets[0] = childrenOffsets[childrenOffsets.length - 1];
			}
			
			var distance = stageHeight;
			var closestChildOffset = 0;
			
			for(var i = 0; i < arrayOfOffsets.length; i++) {
				
				var newDistance = Math.abs(offset - arrayOfOffsets[i]);

				if(newDistance < distance) {
					closestChildOffset = arrayOfOffsets[i];
					distance = newDistance;
				}
				
			}
			
			for(var i = 0; i < childrenOffsets.length; i++) {
				
				if(closestChildOffset == childrenOffsets[i]) {
					newChildOffset = i;
						
				}
				
			}
			
			return newChildOffset;
		
		},
		
		changeSlide: function(slide, node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {

			helpers.autoSlidePause(sliderNumber);
			
			for(var j = 0; j < scrollTimeouts.length; j++) {
				clearTimeout(scrollTimeouts[j]);
			}
			
			var steps = Math.ceil(settings.autoSlideTransTimer / 10) + 1;
			var startOffset = helpers.getSliderOffset(node, 'y');
			var endOffset = childrenOffsets[slide];
			var offsetDiff = endOffset - startOffset;
			var direction = slide - (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			if(settings.infiniteSlider) {
				
				slide = (slide - infiniteSliderOffset[sliderNumber] + numberOfSlides * 2)%numberOfSlides;
				
				var appendArray = false;
				if((slide == 0) && (numberOfSlides == 2)) {
					
					slide = numberOfSlides;
					childrenOffsets[slide] = childrenOffsets[slide-1] - $(slideNodes).eq(0).outerHeight(true);
					appendArray = true;
					
				}
				
				endOffset = childrenOffsets[slide];
				offsetDiff = endOffset - startOffset;
				
				var offsets = new Array(childrenOffsets[slide] - $(node).height(), childrenOffsets[slide] + $(node).height());
				
				if(appendArray) {
					childrenOffsets.splice(childrenOffsets.length-1, 1);
				}
				
				for(var i = 0; i < offsets.length; i++) {
					
					if(Math.abs(offsets[i] - startOffset) < Math.abs(offsetDiff)) {
						offsetDiff = (offsets[i] - startOffset);
					}
				
				}
				
				if((offsetDiff < 0) && (direction == -1)) {
					offsetDiff += $(node).height();
				} else if((offsetDiff > 0) && (direction == 1)) {
					offsetDiff -= $(node).height();
				}
				
			}
			
			var stepArray = new Array();
			var t;
			var nextStep;

			helpers.showScrollbar(settings, scrollbarClass);

			for(var i = 0; i <= steps; i++) {

				t = i;
				t /= steps;
				t--;
				nextStep = startOffset + offsetDiff*(Math.pow(t,5) + 1);
				
				stepArray[stepArray.length] = nextStep;
				
			}
			
			var tempOffset = (slide + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			var lastCheckOffset = 0;
			for(var i = 0; i < stepArray.length; i++) {
				
				if((i == 0) || (Math.abs(stepArray[i] - lastCheckOffset) > 1) || (i >= (stepArray.length - 2))) {

					lastCheckOffset	= stepArray[i];
					
					scrollTimeouts[i] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * (i + 1), node, slideNodes, stepArray[i], scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterHeights, sliderNumber, centeredSlideOffset, tempOffset, settings);
						
				}
				
				if((i == 0) && (settings.onSlideStart != '')) {
					var tempOffset = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;		
				
					settings.onSlideStart(new helpers.args('start', settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, slide));
				}
					
			}

			var slideChanged = false;
			
			if(settings.infiniteSlider) {
				
				if(tempOffset != activeChildInfOffsets[sliderNumber]) {
					slideChanged = true;
				}
					
			} else {
			
				if(slide != activeChildOffsets[sliderNumber]) {
					slideChanged = true;
				}
			
			}
				
			if(slideChanged && (settings.onSlideComplete != '')) {

				scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (i + 1), settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, sliderNumber);
			}
			
			slideTimeouts[sliderNumber] = scrollTimeouts;
			
			helpers.hideScrollbar(settings, scrollTimeouts, i, stepArray, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber);
			
			helpers.autoSlide(node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
			
		},
		
		changeOffset: function(endOffset, node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {
		
			helpers.autoSlidePause(sliderNumber);
			
			for(var j = 0; j < scrollTimeouts.length; j++) {
				clearTimeout(scrollTimeouts[j]);
			}
			
			if(!settings.infiniteSlider) {
				endOffset = (endOffset > (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) ? sliderMin[sliderNumber] * -1 + centeredSlideOffset : endOffset;
				endOffset = (endOffset < (sliderMax[sliderNumber] * -1)) ? sliderMax[sliderNumber] * -1 : endOffset;
			}
			
			var steps = Math.ceil(settings.autoSlideTransTimer / 10) + 1;
			var startOffset = helpers.getSliderOffset(node, 'y');
			var slide = (helpers.calcActiveOffset(settings, endOffset, childrenOffsets, stageHeight, infiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber) + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			var testOffsets = childrenOffsets.slice();
			
			if(settings.snapToChildren && !settings.infiniteSlider) {
				endOffset = childrenOffsets[slide];
			} else if(settings.infiniteSlider && settings.snapToChildren) {
				while(endOffset >= testOffsets[0]) {
					testOffsets.splice(0, 0, testOffsets[numberOfSlides-1] + $(node).height());
					testOffsets.splice(numberOfSlides, 1);
				}
				
				while(endOffset <= testOffsets[numberOfSlides-1]) {
					testOffsets.splice(numberOfSlides, 0, testOffsets[0] - $(node).height());
					testOffsets.splice(0, 1);
				}
				
				slide = helpers.calcActiveOffset(settings, endOffset, testOffsets, stageHeight, infiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber);
				endOffset = testOffsets[slide];
				
			}
			
			var offsetDiff = endOffset - startOffset;
						
			var stepArray = new Array();
			var t;
			var nextStep;

			helpers.showScrollbar(settings, scrollbarClass);

			for(var i = 0; i <= steps; i++) {

				t = i;
				t /= steps;
				t--;
				nextStep = startOffset + offsetDiff*(Math.pow(t,5) + 1);
				
				stepArray[stepArray.length] = nextStep;
				
			}
			
			var tempOffset = (slide + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			var lastCheckOffset = 0;
			for(var i = 0; i < stepArray.length; i++) {
				
				if((i == 0) || (Math.abs(stepArray[i] - lastCheckOffset) > 1) || (i >= (stepArray.length - 2))) {

					lastCheckOffset	= stepArray[i];
					
					scrollTimeouts[i] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * (i + 1), node, slideNodes, stepArray[i], scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterHeights, sliderNumber, centeredSlideOffset, tempOffset, settings);
						
				}
				
				if((i == 0) && (settings.onSlideStart != '')) {
					var tempOffset = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;		
				
					settings.onSlideStart(new helpers.args('start', settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, slide));
				}
					
			}

			var slideChanged = false;
			
			if(settings.infiniteSlider) {
				
				if(tempOffset != activeChildInfOffsets[sliderNumber]) {
					slideChanged = true;
				}
					
			} else {
			
				if(slide != activeChildOffsets[sliderNumber]) {
					slideChanged = true;
				}
			
			}
				
			if(slideChanged && (settings.onSlideComplete != '')) {

				scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (i + 1), settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, sliderNumber);
			}
			
			slideTimeouts[sliderNumber] = scrollTimeouts;
			
			helpers.hideScrollbar(settings, scrollTimeouts, i, stepArray, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber);
			
			helpers.autoSlide(node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
			
		},
		
		autoSlide: function(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {
			
			if(!iosSliderSettings[sliderNumber].autoSlide) return false;
			
			helpers.autoSlidePause(sliderNumber);

			autoSlideTimeouts[sliderNumber] = setTimeout(function() {
				
				if(!settings.infiniteSlider && (activeChildOffsets[sliderNumber] > childrenOffsets.length-1)) {
					activeChildOffsets[sliderNumber] = activeChildOffsets[sliderNumber] - numberOfSlides;
				}
				
				var nextSlide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + childrenOffsets.length + 1)%childrenOffsets.length;
				
				helpers.changeSlide(nextSlide, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
				
				helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
				
			}, settings.autoSlideTimer + settings.autoSlideTransTimer);
			
		},
		
		autoSlidePause: function(sliderNumber) {

			clearTimeout(autoSlideTimeouts[sliderNumber]);

		},
		
		isUnselectable: function(node, settings) {

			if(settings.unselectableSelector != '') {
				if($(node).closest(settings.unselectableSelector).size() == 1) return true;
			}
			
			return false;
			
		},
		
		/* timers */
		slowScrollHorizontalIntervalTimer: function(scrollIntervalTime, node, slideNodes, step, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterHeights, sliderNumber, centeredSlideOffset, endOffset, settings) {
		
			var scrollTimeout = setTimeout(function() {
				helpers.slowScrollHorizontalInterval(node, slideNodes, step, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterHeights, sliderNumber, centeredSlideOffset, endOffset, settings);
			}, scrollIntervalTime);
			
			return scrollTimeout;
		
		},
		
		onSlideCompleteTimer: function(scrollIntervalTime, settings, node, slideNode, slide, scrollbarNumber) {
			
			var scrollTimeout = setTimeout(function() {
				helpers.onSlideComplete(settings, node, slideNode, slide, scrollbarNumber);
			}, scrollIntervalTime);
			
			return scrollTimeout;
		
		},
		
		hideScrollbarIntervalTimer: function(scrollIntervalTime, newOffset, opacity, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber, settings) {

			var scrollTimeout = setTimeout(function() {
				helpers.hideScrollbarInterval(newOffset, opacity, scrollbarClass, scrollbarHeight, stageHeight, scrollMargin, scrollBorder, sliderNumber, settings);
			}, scrollIntervalTime);
		
			return scrollTimeout;
		
		},
						
		args: function(func, settings, node, activeSlideNode, newChildOffset, targetSlideOffset) {
			
			this.prevSlideNumber = ($(node).parent().data('args') == undefined) ? undefined : $(node).parent().data('args').prevSlideNumber;
			this.prevSlideObject = ($(node).parent().data('args') == undefined) ? undefined : $(node).parent().data('args').prevSlideObject;
			this.targetSlideNumber = targetSlideOffset + 1;
			this.targetSlideObject = $(node).children(':eq(' + this.targetSlideOffset + ')');
			this.slideChanged = false;
			
			if(func == 'load') {
				this.targetSlideNumber = undefined;
				this.targetSlideObject = undefined;
			} else if(func == 'start') {
				this.targetSlideNumber = undefined;
				this.targetSlideObject = undefined;
			} else if(func == 'change') {
				this.slideChanged = true;
				this.prevSlideNumber = ($(node).parent().data('args') == undefined) ? settings.startAtSlide : $(node).parent().data('args').currentSlideNumber;	
				this.prevSlideObject = $(node).children(':eq(' + this.prevSlideNumber + ')');
			} else if(func == 'complete') {
				this.slideChanged = $(node).parent().data('args').slideChanged;
			}
			
			this.settings = settings;
			this.data = $(node).parent().data('iosSliderVertical');
			this.sliderObject = node;
			this.sliderContainerObject = $(node).parent();

			this.currentSlideObject = activeSlideNode;
			this.currentSlideNumber = newChildOffset + 1;
			this.currentSliderOffset = helpers.getSliderOffset(node, 'y') * -1;

		},
		
		preventDrag: function(event) {
			event.preventDefault();
		},
		
		preventClick: function(event) {
			event.stopImmediatePropagation();
			return false;
		},
		
		enableClick: function() {
			return true;
		}
        
    }
    
    helpers.setBrowserInfo();
    
    var methods = {
		
		init: function(options, node) {

			has3DTransform = helpers.has3DTransform();
			
			var settings = $.extend(true, {
				'elasticPullResistance': 0.6, 		
				'frictionCoefficient': 0.92,
				'elasticFrictionCoefficient': 0.6,
				'snapFrictionCoefficient': 0.92,
				'snapToChildren': false,
				'snapSlideCenter': false,
				'startAtSlide': 1,
				'mousewheelScroll': true,
				'mousewheelScrollSensitivity': 1,
				'mousewheelScrollOverflow': false,
				'scrollbar': true,
				'scrollbarDrag': true,
				'scrollbarHide': false,
				'scrollbarLocation': 'right',
				'scrollbarContainer': '',
				'scrollbarOpacity': 0.4,
				'scrollbarWidth': '8px',
				'scrollbarBorder': '0',
				'scrollbarMargin': '5px',
				'scrollbarBackground': '#000',
				'scrollbarBorderRadius': '100px',
				'scrollbarShadow': '0 0 0 #000',
				'scrollbarElasticPullResistance': 0.9,
				'desktopClickDrag': false,
				'keyboardControls': false,
				'tabToAdvance': false,
				'responsiveSlideContainer': true,
				'responsiveSlides': false,
				'navSlideSelector': '',
				'navPrevSelector': '',
				'navNextSelector': '',
				'autoSlideToggleSelector': '',
				'autoSlide': false,
				'autoSlideTimer': 5000,
				'autoSlideTransTimer': 750,
				'autoSlideHoverPause': true,
				'infiniteSlider': false,
				'snapVelocityThreshold': 5,
				'slideStartVelocityThreshold': 0,
				'verticalSlideLockThreshold': 0,
				'horizontalSlideLockThreshold': 3,
				'stageCSS': {
					position: 'relative',
					top: '0',
					left: '0',
					overflow: 'hidden',
					zIndex: 1
				},
				'unselectableSelector': '',
				'onSliderLoaded': '',
				'onSliderUpdate': '',
				'onSliderResize': '',
				'onSlideStart': '',
				'onSlideChange': '',
				'onSlideComplete': ''
			}, options);
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function(i) {
				
				scrollbarNumber++;
				var sliderNumber = scrollbarNumber;
				var scrollTimeouts = new Array();
				iosSliderSettings[sliderNumber] = settings;
				sliderMin[sliderNumber] = 0;
				sliderMax[sliderNumber] = 0;
				var minTouchpoints = 0;
				var yCurrentScrollRate = new Array(0, 0);
				var xCurrentScrollRate = new Array(0, 0);
				var scrollbarBlockClass = 'vScrollbarBlock' + scrollbarNumber;
				var scrollbarClass = 'vScrollbar' + scrollbarNumber;
				var scrollbarNode;
				var scrollbarBlockNode;
				var scrollbarStageHeight;
				var scrollbarHeight;
				var containerHeight;
				var containerWidth;
				var centeredSlideOffset = 0;
				var stageNode = $(this);
				var stageHeight;
				var stageWidth;
				var slideWidth;
				var scrollMargin;
				var scrollBorder;
				var lastTouch;
				var isFirstInit = true;
				var newChildOffset = -1;
				var webkitTransformArray = new Array();
				var childrenOffsets;
				var originalOffsets = new Array();
				var scrollbarStartOpacity = 0;
				var yScrollStartPosition = 0;
				var xScrollStartPosition = 0;
				var currentTouches = 0;
				var scrollerNode = $(this).children(':first-child');
				var slideNodes;
				var slideNodeHeights;
				var slideNodeOuterHeights;
				var numberOfSlides = $(scrollerNode).children().not('script').size();
				var yScrollStarted = false;
				var lastChildOffset = 0;
				var isMouseDown = false;
				var currentSlider = undefined;
				var sliderStopLocation = 0;
				var infiniteSliderWidth;
				infiniteSliderOffset[sliderNumber] = 0;
				var shortContent = false;
				onChangeEventLastFired[sliderNumber] = -1;
				var isAutoSlideToggleOn = false;
				iosSliders[sliderNumber] = stageNode;
				isEventCleared[sliderNumber] = false;
				var currentEventNode;
				var intermediateChildOffset = 0;
				var tempInfiniteSliderOffset = 0;
				var preventYScroll = false;
				var snapOverride = false;
				var clickEvent = 'touchstart.iosSliderVerticalEvent click.iosSliderVerticalEvent';
				var scrollerHeight;
				var anchorEvents;
				var onclickEvents;
				var allScrollerNodeChildren;
				var mouseWheelDelta = 0;
				var mouseWheelScroll = false;
				var mouseWheelEvent;
				var mouseWheelMax = false;
				touchLocks[sliderNumber] = false;
				slideTimeouts[sliderNumber] = new Array();
				
				var $this = $(this);
				var data = $this.data('iosSliderVertical');	
				if(data != undefined) return true;
           		
           		var xArray = ['d', 'e', 'm', 'o', ' ', 'v', 'e', 'r', 's', 'i', 'o', 'n'];
				var xClass = Math.floor(Math.random()*12317);
				$(scrollerNode).parent().append("<i class = 'i" + xClass + "'></i>").append("<i class = 'i" + xClass + "'></i>");
				$('.i' + xClass).css({ position: 'absolute', right: '10px', bottom: '10px', zIndex: 1000, fontStyle: 'normal', background: '#fff', opacity: 0.2 }).eq(1).css({ bottom: 'auto', right: 'auto', top: '10px', left: '10px' });
				for(var i = 0; i < xArray.length; i++) { $('.i' + xClass).html($('.i' + xClass).html() + xArray[i]); }

           		$(this).find('img').bind('dragstart.iosSliderVerticalEvent', function(event) { event.preventDefault(); });

				if(settings.infiniteSlider) {
					settings.scrollbar = false;
				}
				
				if(settings.infiniteSlider && (numberOfSlides == 1)) {
					settings.infiniteSlider = false;
				}
				
				if(settings.scrollbar) {
					
					if(settings.scrollbarContainer != '') {
						$(settings.scrollbarContainer).append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>");
					} else {
						$(scrollerNode).parent().append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>");
					}
				
				}
				
				if(!init()) return true;
				
				$(this).find('a').bind('mousedown', helpers.preventDrag);
				$(this).find("[onclick]").bind('click', helpers.preventDrag).each(function() {
					
					$(this).data('onclick', this.onclick);
				
				});
				
				var newChildOffset = helpers.calcActiveOffset(settings, helpers.getSliderOffset($(scrollerNode), 'y'), childrenOffsets, stageHeight, infiniteSliderOffset[sliderNumber], numberOfSlides, undefined, sliderNumber);
				var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
				
				var args = new helpers.args('load', settings, scrollerNode, $(scrollerNode).children(':eq(' + tempOffset + ')'), tempOffset, tempOffset);
				$(stageNode).data('args', args);

				if(settings.onSliderLoaded != '') {

					settings.onSliderLoaded(args);
					
				}
				
				onChangeEventLastFired[sliderNumber] = tempOffset;

				function init() {
					
					helpers.autoSlidePause(sliderNumber);
					
					anchorEvents = $(scrollerNode).find('a');
					onclickEvents = $(scrollerNode).find('[onclick]');
					allScrollerNodeChildren = $(scrollerNode).find('*');
					
					$(stageNode).css('width', '');
					$(stageNode).css('height', '');
					$(scrollerNode).css('height', '');
					slideNodes = $(scrollerNode).children().not('script').get();
					slideNodeHeights = new Array();
					slideNodeOuterHeights = new Array();
					
					$(slideNodes).css('height', '');
					
					sliderMax[sliderNumber] = 0;
					childrenOffsets = new Array();
					containerHeight = $(stageNode).parent().height();
					stageHeight = $(stageNode).outerHeight(true);
					
					if(settings.responsiveSlideContainer) {
						stageHeight = ($(stageNode).outerHeight(true) > containerHeight) ? containerHeight : $(stageNode).outerHeight(true);
					}

					$(stageNode).css({
						position: settings.stageCSS.position,
						top: settings.stageCSS.top,
						left: settings.stageCSS.left,
						overflow: settings.stageCSS.overflow,
						zIndex: settings.stageCSS.zIndex,
						'webkitPerspective': 1000,
						'webkitBackfaceVisibility': 'hidden',
						'msTouchAction': 'pan-x',
						height: stageHeight
					});
					
					$(settings.unselectableSelector).css({
						cursor: 'default'
					});
						
					for(var j = 0; j < slideNodes.length; j++) {
						
						$(slideNodes[j]).css({
							'webkitBackfaceVisibility': 'hidden',
							position: 'absolute',
							left: 0
						});
						
						slideNodeHeights[j] = $(slideNodes[j]).height();
						slideNodeOuterHeights[j] = $(slideNodes[j]).outerHeight(true);
						var newHeight = slideNodeOuterHeights[j];
						
						if(settings.responsiveSlides) {

							if(slideNodeOuterHeights[j] > stageHeight) {
								
								newHeight = stageHeight + (slideNodeOuterHeights[j] - slideNodeHeights[j]) * -1;
								
							} else {

								newHeight = slideNodeHeights[j];
								
							}
							
							$(slideNodes[j]).css({
								height: newHeight
							});
						
						} else {
							
							$(slideNodes[j]).css({
								height: slideNodeHeights[j]
							});
						
						}
						
						childrenOffsets[j] = sliderMax[sliderNumber] * -1;
						
						sliderMax[sliderNumber] = sliderMax[sliderNumber] + newHeight;
						
					}

					if(settings.snapSlideCenter) {
						centeredSlideOffset = (stageHeight - slideNodeOuterHeights[0]) * 0.5;
						
						if(settings.responsiveSlides && (slideNodeOuterHeights[0] > stageHeight)) {
							centeredSlideOffset = 0;
						}
					}
					
					sliderAbsMax[sliderNumber] = sliderMax[sliderNumber] * 2;
					
					for(var j = 0; j < slideNodes.length; j++) {
						
						helpers.setSliderOffset($(slideNodes[j]), childrenOffsets[j] * -1 + sliderMax[sliderNumber] + centeredSlideOffset);
						
						childrenOffsets[j] = childrenOffsets[j] - sliderMax[sliderNumber];
					
					}
					
					if(!settings.infiniteSlider && !settings.snapSlideCenter) {
					
						for(var i = 0; i < childrenOffsets.length; i++) {
							
							if(childrenOffsets[i] <= ((sliderMax[sliderNumber] * 2 - stageHeight) * -1)) {
								break;
							}
							
							lastChildOffset = i;
							
						}
						
						childrenOffsets.splice(lastChildOffset + 1, childrenOffsets.length);
						childrenOffsets[childrenOffsets.length] = (sliderMax[sliderNumber] * 2 - stageHeight) * -1;
					
					}
					
					for(var i = 0; i < childrenOffsets.length; i++) {
						originalOffsets[i] = childrenOffsets[i];
					}
					
					if(isFirstInit) {
						settings.startAtSlide = (iosSliderSettings[sliderNumber].startAtSlide > childrenOffsets.length) ? childrenOffsets.length : iosSliderSettings[sliderNumber].startAtSlide;
						if(settings.infiniteSlider) {
							settings.startAtSlide = (iosSliderSettings[sliderNumber].startAtSlide - 1 + numberOfSlides)%numberOfSlides;
							activeChildOffsets[sliderNumber] = (iosSliderSettings[sliderNumber].startAtSlide);
						} else {
							settings.startAtSlide = ((iosSliderSettings[sliderNumber].startAtSlide - 1) < 0) ? childrenOffsets.length-1 : iosSliderSettings[sliderNumber].startAtSlide;	
							activeChildOffsets[sliderNumber] = (iosSliderSettings[sliderNumber].startAtSlide-1);
						}
						activeChildInfOffsets[sliderNumber] = activeChildOffsets[sliderNumber];
					}
					
					sliderMin[sliderNumber] = sliderMax[sliderNumber] + centeredSlideOffset;

					$(scrollerNode).css({
						position: 'relative',
						cursor: grabOutCursor,
						'webkitPerspective': '0',
						'webkitBackfaceVisibility': 'hidden',
						height: sliderMax[sliderNumber] + 'px'
					});
					
					scrollerHeight = sliderMax[sliderNumber];
					sliderMax[sliderNumber] = sliderMax[sliderNumber] * 2 - stageHeight + centeredSlideOffset * 2;
					
					shortContent = (scrollerHeight < stageHeight) ? true : false;

					if(shortContent) {
						
						$(scrollerNode).css({
							cursor: 'default'
						});
						
					}
					
					containerWidth = $(stageNode).parent().outerWidth(true);
					stageWidth = $(stageNode).width();
					
					if(settings.responsiveSlideContainer) {
						stageWidth = (stageWidth > containerWidth) ? containerWidth : stageWidth;
					}
					
					$(stageNode).css({
						width: stageWidth
					});

					helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]);
					
					if(settings.infiniteSlider && !shortContent) {
						
						var currentScrollOffset = helpers.getSliderOffset($(scrollerNode), 'y');
						var count = (infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides * -1;
						
						while(count < 0) {
							
							var lowSlideNumber = 0;
							var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'y') < lowSlideOffset) {
									lowSlideOffset = helpers.getSliderOffset(this, 'y');
									lowSlideNumber = i;
								}
								
							});
							
							var newOffset = sliderMin[sliderNumber] + scrollerHeight;
							helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);
							
							sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

							childrenOffsets.splice(0, 1);
							childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

							count++;
							
						}
						
						while(((childrenOffsets[0] * -1 - scrollerHeight + centeredSlideOffset) > 0) && settings.snapSlideCenter && isFirstInit) {
							
							var highSlideNumber = 0;
							var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'y') > highSlideOffset) {
									highSlideOffset = helpers.getSliderOffset(this, 'y');
									highSlideNumber = i;
								}
								
							});

							var newOffset = sliderMin[sliderNumber] - slideNodeOuterHeights[highSlideNumber];
							helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);
							
							childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
							childrenOffsets.splice(childrenOffsets.length-1, 1);

							sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

							infiniteSliderOffset[sliderNumber]--;
							activeChildOffsets[sliderNumber]++;
							
						}
						
						while(currentScrollOffset <= (sliderMax[sliderNumber] * -1)) {
							
							var lowSlideNumber = 0;
							var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'y') < lowSlideOffset) {
									lowSlideOffset = helpers.getSliderOffset(this, 'y');
									lowSlideNumber = i;
								}
								
							});
							
							var newOffset = sliderMin[sliderNumber] + scrollerHeight;
							helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);	
							
							sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

							childrenOffsets.splice(0, 1);
							childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

							infiniteSliderOffset[sliderNumber]++;
							activeChildOffsets[sliderNumber]--;
							
						}
					
					}
					
					helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]);
					
					if(!settings.desktopClickDrag) {
						
						$(scrollerNode).css({
							cursor: 'default'
						});
						
					}
					
					if(settings.scrollbar) {
						
						$('.' + scrollbarBlockClass).css({ 
							margin: settings.scrollbarMargin,
							overflow: 'hidden',
							display: 'none'
						});
						
						$('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({ 
							border: settings.scrollbarBorder
						});
						
						scrollMargin = parseInt($('.' + scrollbarBlockClass).css('marginLeft')) + parseInt($('.' + scrollbarBlockClass).css('marginRight'));
						scrollBorder = parseInt($('.' + scrollbarBlockClass + ' .' + scrollbarClass).css('borderLeftWidth'), 10) + parseInt($('.' + scrollbarBlockClass + ' .' + scrollbarClass).css('borderRightWidth'), 10);
						scrollbarStageHeight = (settings.scrollbarContainer != '') ? $(settings.scrollbarContainer).height() : stageHeight;
						scrollbarHeight = (stageHeight / scrollerHeight) * (scrollbarStageHeight - scrollMargin);
		
						if(!settings.scrollbarHide) {
							scrollbarStartOpacity = settings.scrollbarOpacity;
						}
						
						$('.' + scrollbarBlockClass).css({ 
							position: 'absolute',
							top: 0,
							height: scrollbarStageHeight - scrollMargin + 'px',
							margin: settings.scrollbarMargin
						});
						
						if(settings.scrollbarLocation == 'left') {
							$('.' + scrollbarBlockClass).css('left', '0');
						} else {
							$('.' + scrollbarBlockClass).css('right', '0');
						}

						$('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({ 
							borderRadius: settings.scrollbarBorderRadius,
							background: settings.scrollbarBackground,
							width: settings.scrollbarWidth,
							height: scrollbarHeight - scrollBorder + 'px',
							minHeight: settings.scrollbarWidth,
							border: settings.scrollbarBorder,
							'webkitPerspective': 1000,
							'webkitBackfaceVisibility': 'hidden',
							'position': 'relative',
							opacity: scrollbarStartOpacity,
							filter: 'alpha(opacity:' + (scrollbarStartOpacity * 100) + ')',
							boxShadow: settings.scrollbarShadow
						});
						
						helpers.setSliderOffset($('.' + scrollbarBlockClass + ' .' + scrollbarClass), Math.floor((childrenOffsets[activeChildOffsets[sliderNumber]] * -1 - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageHeight - scrollMargin - scrollbarHeight)));
		
						$('.' + scrollbarBlockClass).css({
							display: 'block'
						});
						
						scrollbarNode = $('.' + scrollbarBlockClass + ' .' + scrollbarClass);
						scrollbarBlockNode = $('.' + scrollbarBlockClass);						
						
					}
					
					if(settings.scrollbarDrag && !shortContent) {
						$('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({
							cursor: grabOutCursor
						});
					}
					
					if(settings.infiniteSlider) {
					
						infiniteSliderWidth = (sliderMax[sliderNumber] + stageHeight) / 3;
						
					}
					
					if(settings.navSlideSelector != '') {
								
						$(settings.navSlideSelector).each(function(j) {
						
							$(this).css({
								cursor: 'pointer'
							});
							
							$(this).unbind(clickEvent).bind(clickEvent, function(e) {
								
								if(e.type == 'touchstart') {
									$(this).unbind('click.iosSliderVerticalEvent');
								} else {
									$(this).unbind('touchstart.iosSliderVerticalEvent');
								}
								clickEvent = e.type + '.iosSliderVerticalEvent';

								helpers.changeSlide(j, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
								
							});
						
						});
								
					}	
					
					if(settings.navPrevSelector != '') {
						
						$(settings.navPrevSelector).css({
							cursor: 'pointer'
						});
						
						$(settings.navPrevSelector).unbind(clickEvent).bind(clickEvent, function(e) {	
							
							if(e.type == 'touchstart') {
								$(this).unbind('click.iosSliderVerticalEvent');
							} else {
								$(this).unbind('touchstart.iosSliderVerticalEvent');
							}
							clickEvent = e.type + '.iosSliderVerticalEvent';

							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
											
							if((slide > 0) || settings.infiniteSlider) {
								helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							}
						});
					
					}
					
					if(settings.navNextSelector != '') {
						
						$(settings.navNextSelector).css({
							cursor: 'pointer'
						});
						
						$(settings.navNextSelector).unbind(clickEvent).bind(clickEvent, function(e) {
							
							if(e.type == 'touchstart') {
								$(this).unbind('click.iosSliderVerticalEvent');
							} else {
								$(this).unbind('touchstart.iosSliderVerticalEvent');
							}
							clickEvent = e.type + '.iosSliderVerticalEvent';
							
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
							
							if((slide < childrenOffsets.length-1) || settings.infiniteSlider) {
								helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							}
						});
					
					}
					
					if(settings.autoSlide && !shortContent) {
						
						if(settings.autoSlideToggleSelector != '') {
						
							$(settings.autoSlideToggleSelector).css({
								cursor: 'pointer'
							});
							
							$(settings.autoSlideToggleSelector).unbind(clickEvent).bind(clickEvent, function(e) {
								
								if(e.type == 'touchstart') {
									$(this).unbind('click.iosSliderVerticalEvent');
								} else {
									$(this).unbind('touchstart.iosSliderVerticalEvent');
								}
								clickEvent = e.type + '.iosSliderVerticalEvent';
							
								if(!isAutoSlideToggleOn) {
								
									helpers.autoSlidePause(sliderNumber);
									isAutoSlideToggleOn = true;
									
									$(settings.autoSlideToggleSelector).addClass('on');
									
								} else {
									
									helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
									
									isAutoSlideToggleOn = false;
									
									$(settings.autoSlideToggleSelector).removeClass('on');
									
								}
							
							});
						
						}
					
					}
					
					helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);

					$(stageNode).bind('mouseleave.iosSliderVerticalEvent', function() {

						helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
						
					});
					
					$(stageNode).bind('touchend.iosSliderVerticalEvent', function() {
					
						helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
					
					});
					
					if(settings.autoSlideHoverPause) {
						$(stageNode).bind('mouseenter.iosSliderVerticalEvent', function() {
							helpers.autoSlidePause(sliderNumber);
						});
					}
					
					$(stageNode).data('iosSliderVertical', {
						obj: $this,
						settings: settings,
						scrollerNode: scrollerNode,
						slideNodes: slideNodes,
						numberOfSlides: numberOfSlides,
						centeredSlideOffset: centeredSlideOffset,
						sliderNumber: sliderNumber,
						originalOffsets: originalOffsets,
						childrenOffsets: childrenOffsets,
						sliderMax: sliderMax[sliderNumber],
						scrollbarClass: scrollbarClass,
						scrollbarHeight: scrollbarHeight, 
						scrollbarStageHeight: scrollbarStageHeight,
						stageHeight: stageHeight, 
						scrollMargin: scrollMargin, 
						scrollBorder: scrollBorder, 
						infiniteSliderOffset: infiniteSliderOffset[sliderNumber], 
						infiniteSliderWidth: infiniteSliderWidth,
						slideNodeOuterHeights: slideNodeOuterHeights
					});
					
					isFirstInit = false;
					
					return true;
				
				}
				
				if(settings.scrollbar && !shortContent) {
					
					$(scrollbarBlockNode).bind('click.iosSliderVerticalEvent', function(e) {
						
						if(this == e.target) {
							
							if(e.pageY > $(scrollbarNode).offset().top) {
								methods.nextPage(stageNode);
							} else {
								methods.prevPage(stageNode);
							}
							
						}
					
					});
					
				}
				
				if(iosSliderSettings[sliderNumber].responsiveSlides || iosSliderSettings[sliderNumber].responsiveSlideContainer) {
					
					var orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
					
					$(window).bind(orientationEvent + '.iosSliderVerticalEvent-' + sliderNumber, function() {

						if(!init()) return true;
						
						var args = $(stageNode).data('args');
				
						if(settings.onSliderResize != '') {
					    	settings.onSliderResize(args);
					    }
						
					});
					
				}
				
				if((settings.keyboardControls || settings.tabToAdvance) && !shortContent) {

					$(document).bind('keydown.iosSliderVerticalEvent-' + sliderNumber, function(e) {
						
						if((!isIe7) && (!isIe8)) {
							var e = e.originalEvent;
						}

						if((e.keyCode == 38) && settings.keyboardControls) {
							
							e.preventDefault();
							
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;

							if((slide > 0) || settings.infiniteSlider) {
								helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							} 
								
						} else if(((e.keyCode == 40) && settings.keyboardControls) || ((e.keyCode == 9) && settings.tabToAdvance)) {
							
							e.preventDefault();
							
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
								
							if((slide < childrenOffsets.length-1) || settings.infiniteSlider) {
								helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							}
								
						}
					
					});
					
				}
				
				if(settings.mousewheelScroll && !shortContent) {

					$(scrollerNode).bind('mousewheel.iosSliderVerticalEvent', function(e, delta, deltaX, deltaY) {
						
						for(var j = 0; j < scrollTimeouts.length; j++) {
							clearTimeout(scrollTimeouts[j]);
						}
			
						mouseWheelScroll = true;
						mouseWheelDelta = delta * settings.mousewheelScrollSensitivity * -0.10;
						mouseWheelEvent = e;
						mouseWheelMax = false;
						currentEventNode = undefined;
						
						$(document).trigger('mousemove.iosSliderVerticalEvent');
						
						helpers.slowScrollHorizontal(scrollerNode, slideNodes, true, scrollTimeouts, scrollbarClass, yScrollDistance, xScrollDistance, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
						
						return (mouseWheelMax && settings.mousewheelScrollOverflow);
					
					});
				
				}
					
				if(isTouch || settings.desktopClickDrag || settings.mousewheelScroll || settings.scrollbarDrag) {
					
					var touchStartFlag = false;
					var touchSelection = $(scrollerNode);
					var touchSelectionMove = $(scrollerNode);
					var preventDefault = null;
					var isUnselectable = false;
					
					if(settings.scrollbarDrag) {
						touchSelection = touchSelection.add(scrollbarNode);
						touchSelectionMove = touchSelectionMove.add(scrollbarBlockNode);
					}
					
					$(touchSelection).bind('mousedown.iosSliderVerticalEvent touchstart.iosSliderVerticalEvent', function(e) {

						if(touchStartFlag) return true;
						touchStartFlag = true;
						
						if(e.type == 'touchstart') {
							$(touchSelectionMove).unbind('mousedown.iosSliderVerticalEvent');
						} else {
							$(touchSelectionMove).unbind('touchstart.iosSliderVerticalEvent');
						}
						
						if(touchLocks[sliderNumber] || shortContent) {
							touchStartFlag = false;
							yScrollStarted = false;
							return true;
						}
						
						isUnselectable = helpers.isUnselectable(e.target, settings);
						
						if(isUnselectable) {
							touchStartFlag = false;
							yScrollStarted = false;
							return true;
						}

						if(($(this)[0] === $(scrollerNode)[0]) && !settings.desktopClickDrag && !isTouch) {
							touchStartFlag = false;
							yScrollStarted = false;
							return true;
						}
						
						if(($(this)[0] === $(scrollbarNode)[0]) && !settings.scrollbarDrag) {
							touchStartFlag = false;
							yScrollStarted = false;
							return true;
						}
						
						currentEventNode = ($(this)[0] === $(scrollbarNode)[0]) ? scrollbarNode : scrollerNode;

						if((!isIe7) && (!isIe8)) {
							var e = e.originalEvent;
						}

						helpers.autoSlidePause(sliderNumber);
						
						allScrollerNodeChildren.unbind('.disableClick');
						
						if(e.type == 'touchstart') {
							
							eventY = e.touches[0].pageY;
							eventX = e.touches[0].pageX;
							
						} else {
						
							if(window.getSelection) {
								if (window.getSelection().empty) {
									window.getSelection().empty();
								} else if (window.getSelection().removeAllRanges) {
									window.getSelection().removeAllRanges();
								}
							} else if(document.selection) {
								if(isIe8) {
									try { document.selection.empty(); } catch(e) { /* absorb ie8 bug */ }
								} else {
									document.selection.empty();
								}
							}
							
							eventY = e.pageY;
							eventX = e.pageX;
							
							isMouseDown = true;
							currentSlider = scrollerNode;

							$(this).css({
								cursor: grabInCursor
							});

						}
						
						yCurrentScrollRate = new Array(0, 0);
						xCurrentScrollRate = new Array(0, 0);
						yScrollDistance = 0;
						yScrollStarted = false;
						
						for(var j = 0; j < scrollTimeouts.length; j++) {
							clearTimeout(scrollTimeouts[j]);
						}
						
						var scrollPosition = helpers.getSliderOffset(scrollerNode, 'y');

						if(scrollPosition > (sliderMin[sliderNumber] * -1 + centeredSlideOffset + scrollerHeight)) {
							
							scrollPosition = sliderMin[sliderNumber] * -1 + centeredSlideOffset + scrollerHeight;

							helpers.setSliderOffset($('.' + scrollbarClass), scrollPosition);
							
							$('.' + scrollbarClass).css({
								height: (scrollbarHeight - scrollBorder) + 'px'
							});
							
						} else if(scrollPosition < (sliderMax[sliderNumber] * -1)) {
						
							scrollPosition = sliderMax[sliderNumber] * -1;

							helpers.setSliderOffset($('.' + scrollbarClass), (scrollbarStageHeight - scrollMargin - scrollbarHeight));
							
							$('.' + scrollbarClass).css({
								height: (scrollbarHeight - scrollBorder) + 'px'
							});
							
						}
						
						var scrollbarSubtractor = ($(this)[0] === $(scrollbarNode)[0]) ? (sliderMin[sliderNumber]) : 0;
						
						yScrollStartPosition = (helpers.getSliderOffset(this, 'y') - eventY - scrollbarSubtractor) * -1;
						xScrollStartPosition = (helpers.getSliderOffset(this, 'y') - eventX) * -1;
						
						yCurrentScrollRate[1] = eventY;
						xCurrentScrollRate[1] = eventX;
						
						snapOverride = false;

					});
					
					$(document).bind('touchmove.iosSliderVerticalEvent mousemove.iosSliderVerticalEvent', function(e) {

						if(!isIe7 && !isIe8) {
							var e = e.originalEvent;
						}
						
						if(touchLocks[sliderNumber] || shortContent || isUnselectable || !(touchStartFlag || mouseWheelScroll)) return true;
						
						var edgeDegradation = 0;

						if(mouseWheelScroll) {
							
							e = mouseWheelEvent;
							xScrollDistance = 0;
							yScrollDistance = mouseWheelDelta;
							eventY = yScrollDistance * -1;
							yScrollStartPosition = (helpers.getSliderOffset(scrollerNode, 'y') - yScrollDistance) * -1;
							
						} else {
							
							if(e.type == 'touchmove') {

								eventY = e.touches[0].pageY;
								eventX = e.touches[0].pageX;
								
							} else {

								if(window.getSelection) {
									if(window.getSelection().empty) {
										if(!$(e.target).is('input')) {
											window.getSelection().empty();
										}
									} else if(window.getSelection().removeAllRanges) {
										window.getSelection().removeAllRanges();
									}
								} else if(document.selection) {
									if(isIe8) {
										try { document.selection.empty(); } catch(e) { /* absorb ie8 bug */ }
									} else {
										document.selection.empty();
									}
								}
								
								eventY = e.pageY;
								eventX = e.pageX;
								
								if(!isMouseDown) {
									return true;
								}
	
								if(!isIe) {
									if((typeof e.webkitMovementX != 'undefined' || typeof e.webkitMovementY != 'undefined') && e.webkitMovementY === 0 && e.webkitMovementX === 0) {
										return true;
									}
								}
								
							}
						
							yCurrentScrollRate[0] = yCurrentScrollRate[1];
							yCurrentScrollRate[1] = eventY;
							yScrollDistance = (yCurrentScrollRate[1] - yCurrentScrollRate[0]) / 2;
							
							xCurrentScrollRate[0] = xCurrentScrollRate[1];
							xCurrentScrollRate[1] = eventX;
							xScrollDistance = (xCurrentScrollRate[1] - xCurrentScrollRate[0]) / 2;
						
						}
						
						if(!yScrollStarted) {

							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
							var args = new helpers.args('start', settings, scrollerNode, $(scrollerNode).children(':eq(' + slide + ')'), slide, undefined);
							$(stageNode).data('args', args);

							if(settings.onSlideStart != '') {
								settings.onSlideStart(args);
							}
							
						}
						
						if(((xScrollDistance > settings.horizontalSlideLockThreshold) || (xScrollDistance < (settings.horizontalSlideLockThreshold * -1))) && (e.type == 'touchmove') && (!yScrollStarted)) {
							
							preventYScroll = true;
							
						}
						
						if(((yScrollDistance > settings.verticalSlideLockThreshold) || (yScrollDistance < (settings.verticalSlideLockThreshold * -1))) && (e.type == 'touchmove')) {

							e.preventDefault();
							
						}
						
						if(((yScrollDistance > settings.slideStartVelocityThreshold) || (yScrollDistance < (settings.slideStartVelocityThreshold * -1)))) {

							yScrollStarted = true;
						
						}
						
						if(yScrollStarted && !preventYScroll) {
							
							var scrollPosition = helpers.getSliderOffset(scrollerNode, 'y');
							var scrollbarSubtractor = ($(currentEventNode)[0] === $(scrollbarNode)[0]) ? (sliderMin[sliderNumber]) : centeredSlideOffset;
							var scrollbarMultiplier = ($(currentEventNode)[0] === $(scrollbarNode)[0]) ? ((sliderMin[sliderNumber] - sliderMax[sliderNumber] - centeredSlideOffset) / (scrollbarStageHeight - scrollMargin - scrollbarHeight)) : 1;
							var elasticPullResistance = ($(currentEventNode)[0] === $(scrollbarNode)[0]) ? settings.scrollbarElasticPullResistance : settings.elasticPullResistance;
							var snapCenteredSlideOffset = (settings.snapSlideCenter && ($(currentEventNode)[0] === $(scrollbarNode)[0])) ? 0 : centeredSlideOffset;
							var snapCenteredSlideOffsetScrollbar = (settings.snapSlideCenter && ($(currentEventNode)[0] === $(scrollbarNode)[0])) ? centeredSlideOffset : 0;
							
							if(e.type == 'touchmove') {
								if(currentTouches != e.touches.length) {
									yScrollStartPosition = (scrollPosition * -1) + eventY;
								}
								
								currentTouches = e.touches.length;
							}

							if(settings.infiniteSlider) {

								if(scrollPosition <= (sliderMax[sliderNumber] * -1)) {
									
									var scrollerHeight = $(scrollerNode).height();
									
									if(scrollPosition <= (sliderAbsMax[sliderNumber] * -1)) {

										var sum = originalOffsets[0] * -1;
										$(slideNodes).each(function(i) {
											
											helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
											if(i < childrenOffsets.length) {
												childrenOffsets[i] = sum * -1;
											}
											sum = sum + slideNodeOuterHeights[i];
											
										});
										
										yScrollStartPosition = yScrollStartPosition - childrenOffsets[0] * -1;
										sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;
										infiniteSliderOffset[sliderNumber] = 0;
										
									} else {

										var lowSlideNumber = 0;
										var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
										$(slideNodes).each(function(i) {
											
											if(helpers.getSliderOffset(this, 'y') < lowSlideOffset) {
												lowSlideOffset = helpers.getSliderOffset(this, 'y');
												lowSlideNumber = i;
											}
											
										});
										
										var newOffset = sliderMin[sliderNumber] + scrollerHeight;
										helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);	
										
										sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

										childrenOffsets.splice(0, 1);
										childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

										infiniteSliderOffset[sliderNumber]++;
										
									}
									
								}
								
								if((scrollPosition >= (sliderMin[sliderNumber] * -1)) || (scrollPosition >= 0)) {
		
									var scrollerHeight = $(scrollerNode).height();
									
									if(scrollPosition >= 0) {

										var sum = originalOffsets[0] * -1;
										$(slideNodes).each(function(i) {
											
											helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
											if(i < childrenOffsets.length) {
												childrenOffsets[i] = sum * -1;
											}
											sum = sum + slideNodeOuterHeights[i];
											
										});
										
										yScrollStartPosition = yScrollStartPosition + childrenOffsets[0] * -1;
										sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;
										infiniteSliderOffset[sliderNumber] = numberOfSlides;
										
										while(((childrenOffsets[0] * -1 - scrollerHeight + centeredSlideOffset) > 0)) {
				
											var highSlideNumber = 0;
											var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
											$(slideNodes).each(function(i) {
												
												if(helpers.getSliderOffset(this, 'y') > highSlideOffset) {
													highSlideOffset = helpers.getSliderOffset(this, 'y');
													highSlideNumber = i;
												}
												
											});
				
											var newOffset = sliderMin[sliderNumber] - slideNodeOuterHeights[highSlideNumber];
											helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);
											
											childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
											childrenOffsets.splice(childrenOffsets.length-1, 1);
				
											sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
											sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;
				
											infiniteSliderOffset[sliderNumber]--;
											activeChildOffsets[sliderNumber]++;
											
										}

									} else {

										var highSlideNumber = 0;
										var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'y');
										$(slideNodes).each(function(i) {
											
											if(helpers.getSliderOffset(this, 'y') > highSlideOffset) {
												highSlideOffset = helpers.getSliderOffset(this, 'y');
												highSlideNumber = i;
											}
											
										});
										
										var newOffset = sliderMin[sliderNumber] - slideNodeOuterHeights[highSlideNumber];
										helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);									

										childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
										childrenOffsets.splice(childrenOffsets.length-1, 1);

										sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerHeight - stageHeight;

										infiniteSliderOffset[sliderNumber]--;

									}
								
								}
								
							} else {
								
								var scrollerHeight = $(scrollerNode).height();
								
								if(scrollPosition > (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) {

									edgeDegradation = (sliderMin[sliderNumber] + ((yScrollStartPosition - scrollbarSubtractor - eventY + snapCenteredSlideOffset) * -1 * scrollbarMultiplier) - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier;
									
								}
								
								if(scrollPosition < (sliderMax[sliderNumber] * -1)) {
									
									edgeDegradation = (sliderMax[sliderNumber] + snapCenteredSlideOffsetScrollbar + ((yScrollStartPosition - scrollbarSubtractor - eventY) * -1 * scrollbarMultiplier) - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier;
										
								}
							
							}
							
							var newOffset = ((yScrollStartPosition - scrollbarSubtractor - eventY - edgeDegradation) * -1 * scrollbarMultiplier) - scrollbarSubtractor + snapCenteredSlideOffsetScrollbar;

							if(mouseWheelScroll) {
							
								if(newOffset > (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) {
									newOffset = sliderMin[sliderNumber] * -1 + centeredSlideOffset;
									yScrollStartPosition = helpers.getSliderOffset(scrollerNode, 'y') * -1;
									eventY = 0;
									mouseWheelMax = true;
								}
								
								if(newOffset < (sliderMax[sliderNumber] * -1)) {
									newOffset = sliderMax[sliderNumber] * -1;
									yScrollStartPosition = helpers.getSliderOffset(scrollerNode, 'y') * -1;
									eventY = 0;
									mouseWheelMax = true;
								}
							
							}
							
							helpers.setSliderOffset(scrollerNode, newOffset);
							
							if(settings.scrollbar) {
								
								helpers.showScrollbar(settings, scrollbarClass);

								scrollbarDistance = Math.floor((yScrollStartPosition - eventY - edgeDegradation - sliderMin[sliderNumber] + snapCenteredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageHeight - scrollMargin - scrollbarHeight) * scrollbarMultiplier);
								
								var height = scrollbarHeight;
								
								if(scrollbarDistance <= 0) {

									height = scrollbarHeight - scrollBorder - (scrollbarDistance * -1);
									
									helpers.setSliderOffset($('.' + scrollbarClass), 0);
									
									$('.' + scrollbarClass).css({
										height: height + 'px'
									});
									
								} else if(scrollbarDistance >= (scrollbarStageHeight - scrollMargin - scrollBorder - scrollbarHeight)) {

									height = scrollbarStageHeight - scrollMargin - scrollBorder - scrollbarDistance;
									
									helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
									
									$('.' + scrollbarClass).css({
										height: height + 'px'
									});
									
								} else {
								
									helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
									
								}
								
							}
							
							if(e.type == 'touchmove') {
								lastTouch = e.touches[0].pageX;
							}
							
							var slideChanged = false;
							var newChildOffset = helpers.calcActiveOffset(settings, (yScrollStartPosition - eventY - edgeDegradation) * -1, childrenOffsets, stageHeight, infiniteSliderOffset[sliderNumber], numberOfSlides, undefined, sliderNumber);
							var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
							
							if(settings.infiniteSlider) {
								
								if(tempOffset != activeChildInfOffsets[sliderNumber]) {
									slideChanged = true;
								}
									
							} else {
							
								if(newChildOffset != activeChildOffsets[sliderNumber]) {
									slideChanged = true;
								}
							
							}

							if(slideChanged) {
								
								activeChildOffsets[sliderNumber] = newChildOffset;
								activeChildInfOffsets[sliderNumber] = tempOffset;
								snapOverride = true;
								
								var args = new helpers.args('change', settings, scrollerNode, $(scrollerNode).children(':eq(' + tempOffset + ')'), tempOffset, tempOffset);
								$(stageNode).data('args', args);
								
								if(settings.onSlideChange != '') {
									settings.onSlideChange(args);
								}
								
							}
							
						}

						mouseWheelScroll = false;
						
					});
					
					var eventObject = $(window);

					if(isIe8 || isIe7) {
						var eventObject = $(document); 
					}
					
					$(touchSelection).bind('touchend.iosSliderVerticalEvent', function(e) {
						
						var e = e.originalEvent;
						
						if(touchLocks[sliderNumber] || shortContent) return true;
						
						if(isUnselectable) return true;
						
						if(e.touches.length != 0) {
							
							for(var j = 0; j < e.touches.length; j++) {
								
								if(e.touches[j].pageX == lastTouch) {
									helpers.slowScrollHorizontal(scrollerNode, slideNodes, false, scrollTimeouts, scrollbarClass, yScrollDistance, xScrollDistance, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
								}
								
							}
							
						} else {
							
							helpers.slowScrollHorizontal(scrollerNode, slideNodes, false, scrollTimeouts, scrollbarClass, yScrollDistance, xScrollDistance, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
							
						}
						
						preventYScroll = false;
						touchStartFlag = false;
						
					});
						
					$(eventObject).bind('mouseup.iosSliderVerticalEvent-' + sliderNumber, function(e) {

						if(yScrollStarted) {
							anchorEvents.unbind('click.disableClick').bind('click.disableClick', helpers.preventClick);
						} else {
							anchorEvents.unbind('click.disableClick').bind('click.disableClick', helpers.enableClick);
						}
						
						onclickEvents.each(function() {
							
							this.onclick = function(event) {
								if(xScrollStarted) { 
									return false;
								}
								
								if($(this).data('onclick')) $(this).data('onclick').call(this, event || window.event);
							}
							
							this.onclick = $(this).data('onclick');
							
						});
						
						if(parseFloat($().jquery) >= 1.8) {
							
							allScrollerNodeChildren.each(function() {
									
								var clickObject = $._data(this, 'events');
								
								if(clickObject != undefined) {
									if(clickObject.click != undefined) {

										if(clickObject.click[0].namespace != 'iosSliderEvent') {
											
											if(!yScrollStarted) { 
												return false;
											}

											$(this).one('click.disableClick', helpers.preventClick);
										    var handlers = $._data(this, 'events').click;
										    var handler = handlers.pop();
										    handlers.splice(0, 0, handler);
											
										}
										
									}
								}
								
							});
						
						} else if(parseFloat($().jquery) >= 1.6) {
						
							allScrollerNodeChildren.each(function() {
									
								var clickObject = $(this).data('events');
								
								if(clickObject != undefined) {
									if(clickObject.click != undefined) {

										if(clickObject.click[0].namespace != 'iosSliderEvent') {
											
											if(!yScrollStarted) { 
												return false;
											}
										
											$(this).one('click.disableClick', helpers.preventClick);
										    var handlers = $(this).data('events').click;
										    var handler = handlers.pop();
										    handlers.splice(0, 0, handler);
											
										}
										
									}
								}
								
							});
						
						} else {
						}
						
						if(!isEventCleared[sliderNumber]) {
							
							if(shortContent) return true;
							
							if(settings.desktopClickDrag) {
								$(scrollerNode).css({
									cursor: grabOutCursor
								});
							}
							
							if(settings.scrollbarDrag) {
								$(scrollbarNode).css({
									cursor: grabOutCursor
								});
							}
							
							isMouseDown = false;
							
							if(currentSlider == undefined) {
								return true;
							}

							helpers.slowScrollHorizontal(currentSlider, slideNodes, false, scrollTimeouts, scrollbarClass, yScrollDistance, xScrollDistance, scrollbarHeight, stageHeight, scrollbarStageHeight, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterHeights, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
							
							currentSlider = undefined;
						
						}
						
						preventYScroll = false;
						touchStartFlag = false;
						
					});
				
				}
				
			});	
			
		},
		
		destroy: function(clearStyle, node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {
			
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				if(clearStyle == undefined) {
		    		clearStyle = true;
		    	}
		    	
	    		helpers.autoSlidePause(data.sliderNumber);
		    	isEventCleared[data.sliderNumber] = true;
		    	$(window).unbind('.iosSliderVerticalEvent-' + data.sliderNumber);
		    	$(document).unbind('.iosSliderVerticalEvent-' + data.sliderNumber);
		    	$(document).unbind('keydown.iosSliderVerticalEvent');
		    	$(this).unbind('.iosSliderVerticalEvent');
	    		$(this).children(':first-child').unbind('.iosSliderVerticalEvent');
	    		$(this).children(':first-child').children().unbind('.iosSliderVerticalEvent');
		    	
		    	if(clearStyle) {
	    			$(this).attr('style', '');
		    		$(this).children(':first-child').attr('style', '');
		    		$(this).children(':first-child').children().attr('style', '');
		    		
		    		$(data.settings.navSlideSelector).attr('style', '');
		    		$(data.settings.navPrevSelector).attr('style', '');
		    		$(data.settings.navNextSelector).attr('style', '');
		    		$(data.settings.autoSlideToggleSelector).attr('style', '');
		    		$(data.settings.unselectableSelector).attr('style', '');
	    		}

	    		if(data.settings.scrollbar) {
	    			$('.vScrollbarBlock' + data.sliderNumber).remove();
	    		}
	    		
	    		var scrollTimeouts = slideTimeouts[data.sliderNumber];
	    		
	    		for(var i = 0; i < scrollTimeouts.length; i++) {
					clearTimeout(scrollTimeouts[i]);
				}
	    		
	    		$this.removeData('iosSliderVertical');
	    		$this.removeData('args');
		    	
			});
		
		},
		
		update: function(node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {

				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				data.settings.startAtSlide = $this.data('args').currentSlideNumber;
				methods.destroy(false, this);
				
				if((data.numberOfSlides != 1) && data.settings.infiniteSlider) {
				 	data.settings.startAtSlide = (activeChildOffsets[data.sliderNumber] + 1 + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides)%data.numberOfSlides;
				}

				methods.init(data.settings, this);
				
				var args = new helpers.args('update', data.settings, data.scrollerNode, $(data.scrollerNode).children(':eq(' + (data.settings.startAtSlide - 1) + ')'), data.settings.startAtSlide - 1, data.settings.startAtSlide - 1);
				$(data.stageNode).data('args', args);
				
				if(data.settings.onSliderUpdate != '') {
			    	data.settings.onSliderUpdate(args);
			    }
		    	
			});
		
		},
		
		addSlide: function(slideNode, slidePosition) {

			return this.each(function() {
				
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				if($(data.scrollerNode).children().size() == 0) {
				
					$(data.scrollerNode).append(slideNode);
					$this.data('args').currentSlideNumber = 1;
					
				} else if(!data.settings.infiniteSlider) {
				
					if(slidePosition <= data.numberOfSlides) {
						$(data.scrollerNode).children(':eq(' + (slidePosition - 1) + ')').before(slideNode);
					} else {
						$(data.scrollerNode).children(':eq(' + (slidePosition - 2) + ')').after(slideNode);
					}
					
					if($this.data('args').currentSlideNumber >= slidePosition) {
						$this.data('args').currentSlideNumber++;
					}
					
				} else {
					
					if(slidePosition == 1) {
						$(data.scrollerNode).children(':eq(0)').before(slideNode);
					} else {
						$(data.scrollerNode).children(':eq(' + (slidePosition - 2) + ')').after(slideNode);
					}
					
					if((infiniteSliderOffset[data.sliderNumber] < -1) && (true)) {
						activeChildOffsets[data.sliderNumber]--;
					}
					
					if($this.data('args').currentSlideNumber >= slidePosition) {
						activeChildOffsets[data.sliderNumber]++;
					}
					
				}
					
				$this.data('iosSliderVertical').numberOfSlides++;
				
				methods.update(this);
			
			});
		
		},
		
		removeSlide: function(slideNumber) {
		
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;

				$(data.scrollerNode).children(':eq(' + (slideNumber - 1) + ')').remove();
				if(activeChildOffsets[data.sliderNumber] > (slideNumber - 1)) {
					activeChildOffsets[data.sliderNumber]--;
				}

				methods.update(this);
			
			});
		
		},
		
		goToSlide: function(slide, node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {
					
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				slide = (slide > data.childrenOffsets.length) ? data.childrenOffsets.length - 1 : slide - 1;
				
				helpers.changeSlide(slide, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarHeight, data.stageHeight, data.scrollbarStageHeight, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterHeights, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
				
				activeChildOffsets[data.sliderNumber] = slide;

			});
			
		},
		
		prevSlide: function() {
			
			return this.each(function() {
					
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				var slide = (activeChildOffsets[data.sliderNumber] + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides)%data.numberOfSlides;
				
				if((slide > 0) || data.settings.infiniteSlider) {
					helpers.changeSlide(slide - 1, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarHeight, data.stageHeight, data.scrollbarStageHeight, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterHeights, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
				}
				
				activeChildOffsets[data.sliderNumber] = slide;

			});
			
		},
		
		nextSlide: function() {
			
			return this.each(function() {
					
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				var slide = (activeChildOffsets[data.sliderNumber] + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides)%data.numberOfSlides;
				
				if((slide < data.childrenOffsets.length-1) || data.settings.infiniteSlider) {
					helpers.changeSlide(slide + 1, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarHeight, data.stageHeight, data.scrollbarStageHeight, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterHeights, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
				}
				
				activeChildOffsets[data.sliderNumber] = slide;

			});
			
		},
		
		prevPage: function(node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {

				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				var newOffset = helpers.getSliderOffset(data.scrollerNode, 'y') + data.stageHeight;
				
				helpers.changeOffset(newOffset, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarHeight, data.stageHeight, data.scrollbarStageHeight, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterHeights, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
				
				//activeChildOffsets[data.sliderNumber] = slide;
			
			});
		
		},
		
		nextPage: function(node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {

				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				var newOffset = helpers.getSliderOffset(data.scrollerNode, 'y') - data.stageHeight;
				
				helpers.changeOffset(newOffset, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarHeight, data.stageHeight, data.scrollbarStageHeight, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterHeights, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
				
				//activeChildOffsets[data.sliderNumber] = slide;
			
			});
		
		},
		
		lock: function() {
			
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;

				touchLocks[data.sliderNumber] = true;
			
			});
			
		},
		
		unlock: function() {
		
			return this.each(function() {

				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;

				touchLocks[data.sliderNumber] = false;
			
			});
		
		},
		
		getData: function() {
		
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				return data;
			
			});	
		
		},
		
		autoSlidePause: function() {
			
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				iosSliderSettings[data.sliderNumber].autoSlide = false;
				
				helpers.autoSlidePause(data.sliderNumber);
				
				return data;
			
			});	
		
		},
		
		autoSlidePlay: function() {
			
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosSliderVertical');
				if(data == undefined) return false;
				
				iosSliderSettings[data.sliderNumber].autoSlide = true;
				
				helpers.autoSlide($(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarHeight, data.stageHeight, data.scrollbarStageHeight, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterHeights, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
				
				return data;
			
			});	
			
		}
	
	}
	
	/* public functions */
	$.fn.iosSliderVertical = function(method) {

		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('invalid method call!');
		}
	
    };

}) (jQuery);