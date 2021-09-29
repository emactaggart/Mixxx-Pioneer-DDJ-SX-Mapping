////////////////////////////////////////////////////////////////////////
// JSHint configuration                                               //
////////////////////////////////////////////////////////////////////////
/* global engine                                                      */
/* global script                                                      */
/* global midi                                                        */
/* global bpm                                                         */
/* global components                                                  */
////////////////////////////////////////////////////////////////////////
var PioneerDDJSXRevamp = function() {};

/*
  Evan's Enhancements / Preferences
  - no shift on needle search while track is playing
  - shift-jog-tick speed magnifier works on vinyl mode
  - default beat jump size on start up
  - improved jog wheel controls allowing spinback
  TODO focus on deck 3 and 4


	Author: 		DJMaxergy
	Version: 		1.19, 05/01/2018
	Description: 	Pioneer DDJ-SX Controller Mapping for Mixxx
    Source: 		http://github.com/DJMaxergy/mixxx/tree/pioneerDDJSX_mapping

    Copyright (c) 2018 DJMaxergy, licensed under GPL version 2 or later
    Copyright (c) 2014-2015 various contributors, base for this mapping, licensed under MIT license

    Contributors:
    - Michael Stahl (DG3NEC): original DDJ-SB2 mapping for Mixxx 2.0
    - Sophia Herzog: midiAutoDJ-scripts
    - Joan Ardiaca Jové (joan.ardiaca@gmail.com): Pioneer DDJ-SB mapping for Mixxx 2.0
    - wingcom (wwingcomm@gmail.com): start of Pioneer DDJ-SB mapping
      https://github.com/wingcom/Mixxx-Pioneer-DDJ-SB
    - Hilton Rudham: Pioneer DDJ-SR mapping
      https://github.com/hrudham/Mixxx-Pioneer-DDJ-SR

    GPL license notice for current version:
    This program is free software; you can redistribute it and/or modify it under the terms of the
    GNU General Public License as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
    the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with this program; if
    not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


    MIT License for earlier versions:
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software
    and associated documentation files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or
    substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

///////////////////////////////////////////////////////////////
//                       USER OPTIONS                        //
///////////////////////////////////////////////////////////////

// Sets the jogwheels sensitivity. 1 is default, 2 is twice as sensitive, 0.5 is half as sensitive.
PioneerDDJSXRevamp.jogwheelSensitivity = 1;

// Sets how much more sensitive the jogwheels get when holding shift.
// Set to 1 to disable jogwheel sensitivity increase when holding shift (default: 10).
PioneerDDJSXRevamp.jogwheelShiftMultiplier = 10;

// If true, vu meters twinkle if AutoDJ is enabled (default: true).
PioneerDDJSXRevamp.twinkleVumeterAutodjOn = true;
// If true, selected track will be added to AutoDJ queue-top on pressing shift + rotary selector,
// else track will be added to AutoDJ queue-bottom (default: false).
PioneerDDJSXRevamp.autoDJAddTop = false;
// Sets the duration of sleeping between AutoDJ actions if AutoDJ is enabled [ms] (default: 1000).
PioneerDDJSXRevamp.autoDJTickInterval = 1000;
// Sets the maximum adjustment of BPM allowed for beats to sync if AutoDJ is enabled [BPM] (default: 10).
PioneerDDJSXRevamp.autoDJMaxBpmAdjustment = 10;
// If true, AutoDJ queue is being shuffled after skipping a track (default: false).
// When using a fixed set of tracks without manual intervention, some tracks may be unreachable,
// due to having an unfortunate place in the queue ordering. This solves the issue.
PioneerDDJSXRevamp.autoDJShuffleAfterSkip = false;

// If true, by releasing rotary selector,
// track in preview player jumps forward to "jumpPreviewPosition"
// (default: jumpPreviewEnabled = true, jumpPreviewPosition = 0.3).
PioneerDDJSXRevamp.jumpPreviewEnabled = true;
PioneerDDJSXRevamp.jumpPreviewPosition = 0.3;

// If true, pad press in SAMPLER-PAD-MODE repeatedly causes sampler to play
// loaded track from cue-point, else it causes to play loaded track from the beginning (default: false).
PioneerDDJSXRevamp.samplerCueGotoAndPlay = false;

// If true, PFL / Cue (headphone) is being activated by loading a track into certain deck (default: true).
PioneerDDJSXRevamp.autoPFL = true;


///////////////////////////////////////////////////////////////
//               INIT, SHUTDOWN & GLOBAL HELPER              //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.shiftPressed = false;
PioneerDDJSXRevamp.rotarySelectorChanged = false;
PioneerDDJSXRevamp.panels = [false, false]; // view state of effect and sampler panel
PioneerDDJSXRevamp.shiftPanelSelectPressed = false;

PioneerDDJSXRevamp.syncRate = [0, 0, 0, 0];
PioneerDDJSXRevamp.gridAdjustSelected = [false, false, false, false];
PioneerDDJSXRevamp.gridSlideSelected = [false, false, false, false];
PioneerDDJSXRevamp.needleSearchTouched = [false, false, false, false];
PioneerDDJSXRevamp.chFaderStart = [null, null, null, null];
PioneerDDJSXRevamp.toggledBrake = [false, false, false, false];
PioneerDDJSXRevamp.scratchMode = [true, true, true, true];
PioneerDDJSXRevamp.wheelLedsBlinkStatus = [0, 0, 0, 0];
PioneerDDJSXRevamp.wheelLedsPosition = [0, 0, 0, 0];
PioneerDDJSXRevamp.setUpSpeedSliderRange = [0.08, 0.08, 0.08, 0.08];

PioneerDDJSXRevamp.jog_touched = [false, false, false, false];
PioneerDDJSXRevamp.scratch_timer = [null, null, null, null];

// PAD mode storage:
PioneerDDJSXRevamp.padModes = {
    'hotCue': 0,
    'loopRoll': 1,
    'slicer': 2,
    'sampler': 3,
    'group1': 4,
    'beatloop': 5,
    'group3': 6,
    'group4': 7
};
PioneerDDJSXRevamp.activePadMode = [
    PioneerDDJSXRevamp.padModes.hotCue,
    PioneerDDJSXRevamp.padModes.hotCue,
    PioneerDDJSXRevamp.padModes.hotCue,
    PioneerDDJSXRevamp.padModes.hotCue
];
PioneerDDJSXRevamp.samplerVelocityMode = [false, false, false, false];

// FX storage:
PioneerDDJSXRevamp.fxKnobMSBValue = [0, 0];
PioneerDDJSXRevamp.shiftFxKnobMSBValue = [0, 0];

// used for advanced auto dj features:
PioneerDDJSXRevamp.blinkAutodjState = false;
PioneerDDJSXRevamp.autoDJTickTimer = 0;
PioneerDDJSXRevamp.autoDJSyncBPM = false;
PioneerDDJSXRevamp.autoDJSyncKey = false;

// used for PAD parameter selection:
PioneerDDJSXRevamp.selectedSamplerBank = 0;
PioneerDDJSXRevamp.selectedLoopParam = [0, 0, 0, 0];
PioneerDDJSXRevamp.selectedLoopRollParam = [2, 2, 2, 2];
PioneerDDJSXRevamp.selectedLoopIntervals = [
    [1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32],
    [1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32],
    [1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32],
    [1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32]
];
PioneerDDJSXRevamp.selectedLooprollIntervals = [
    [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8],
    [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8],
    [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8],
    [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8]
];
PioneerDDJSXRevamp.loopIntervals = [
    [1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32],
    [1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 16],
    [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8],
    [1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4]
];
PioneerDDJSXRevamp.selectedSlicerQuantizeParam = [1, 1, 1, 1];
PioneerDDJSXRevamp.selectedSlicerQuantization = [1 / 4, 1 / 4, 1 / 4, 1 / 4];
PioneerDDJSXRevamp.slicerQuantizations = [1 / 8, 1 / 4, 1 / 2, 1];
PioneerDDJSXRevamp.selectedSlicerDomainParam = [0, 0, 0, 0];
PioneerDDJSXRevamp.selectedSlicerDomain = [8, 8, 8, 8];
PioneerDDJSXRevamp.slicerDomains = [8, 16, 32, 64];

// slicer storage:
PioneerDDJSXRevamp.slicerBeatsPassed = [0, 0, 0, 0];
PioneerDDJSXRevamp.slicerPreviousBeatsPassed = [0, 0, 0, 0];
PioneerDDJSXRevamp.slicerActive = [false, false, false, false];
PioneerDDJSXRevamp.slicerAlreadyJumped = [false, false, false, false];
PioneerDDJSXRevamp.slicerButton = [0, 0, 0, 0];
PioneerDDJSXRevamp.slicerModes = {
    'contSlice': 0,
    'loopSlice': 1
};
PioneerDDJSXRevamp.activeSlicerMode = [
    PioneerDDJSXRevamp.slicerModes.contSlice,
    PioneerDDJSXRevamp.slicerModes.contSlice,
    PioneerDDJSXRevamp.slicerModes.contSlice,
    PioneerDDJSXRevamp.slicerModes.contSlice
];


PioneerDDJSXRevamp.init = function(id) {
    PioneerDDJSXRevamp.scratchSettings = {
        'alpha': 1.0 / 8,
        'beta': 1.0 / 8 / 32,
        'jogResolution': 2048,
        'vinylSpeed': 33 + 1 / 3,
    };

    PioneerDDJSXRevamp.channelGroups = {
        '[Channel1]': 0x00,
        '[Channel2]': 0x01,
        '[Channel3]': 0x02,
        '[Channel4]': 0x03
    };

    PioneerDDJSXRevamp.samplerGroups = {
        '[Sampler1]': 0x00,
        '[Sampler2]': 0x01,
        '[Sampler3]': 0x02,
        '[Sampler4]': 0x03,
        '[Sampler5]': 0x04,
        '[Sampler6]': 0x05,
        '[Sampler7]': 0x06,
        '[Sampler8]': 0x07
    };

    PioneerDDJSXRevamp.fxUnitGroups = {
        '[EffectRack1_EffectUnit1]': 0x00,
        '[EffectRack1_EffectUnit2]': 0x01,
        '[EffectRack1_EffectUnit3]': 0x02,
        '[EffectRack1_EffectUnit4]': 0x03
    };

    PioneerDDJSXRevamp.fxEffectGroups = {
        '[EffectRack1_EffectUnit1_Effect1]': 0x00,
        '[EffectRack1_EffectUnit1_Effect2]': 0x01,
        '[EffectRack1_EffectUnit1_Effect3]': 0x02,
        '[EffectRack1_EffectUnit2_Effect1]': 0x00,
        '[EffectRack1_EffectUnit2_Effect2]': 0x01,
        '[EffectRack1_EffectUnit2_Effect3]': 0x02
    };

    PioneerDDJSXRevamp.ledGroups = {
        'hotCue': 0x00,
        'loopRoll': 0x10,
        'slicer': 0x20,
        'sampler': 0x30,
        'group1': 0x40,
        'group2': 0x50,
        'group3': 0x60,
        'group4': 0x70
    };

    PioneerDDJSXRevamp.nonPadLeds = {
        'headphoneCue': 0x54,
        'shiftHeadphoneCue': 0x68,
        'cue': 0x0C,
        'shiftCue': 0x48,
        'keyLock': 0x1A,
        'shiftKeyLock': 0x60,
        'play': 0x0B,
        'shiftPlay': 0x47,
        'vinyl': 0x0D,
        'sync': 0x58,
        'shiftSync': 0x5C,
        'autoLoop': 0x14,
        'shiftAutoLoop': 0x50,
        'loopHalve': 0x12,
        'shiftLoopHalve': 0x61,
        'loopDouble': 0x13,
        'shiftLoopDouble': 0x62,
        'loopIn': 0x10,
        'shiftLoopIn': 0x4C,
        'loopOut': 0x11,
        'shiftLoopOut': 0x4D,
        'censor': 0x15,
        'shiftCensor': 0x38,
        'slip': 0x40,
        'shiftSlip': 0x63,
        'gridAdjust': 0x79,
        'shiftGridAdjust': 0x64,
        'gridSlide': 0x0A,
        'shiftGridSlide': 0x65,
        'takeoverPlus': 0x34,
        'takeoverMinus': 0x37,
        'fx1on': 0x47,
        'shiftFx1on': 0x63,
        'fx2on': 0x48,
        'shiftFx2on': 0x64,
        'fx3on': 0x49,
        'shiftFx3on': 0x65,
        'fxTab': 0x4A,
        'shiftFxTab': 0x66,
        'fx1assignDeck1': 0x4C,
        'shiftFx1assignDeck1': 0x70,
        'fx1assignDeck2': 0x4D,
        'shiftFx1assignDeck2': 0x71,
        'fx1assignDeck3': 0x4E,
        'shiftFx1assignDeck3': 0x72,
        'fx1assignDeck4': 0x4F,
        'shiftFx1assignDeck4': 0x73,
        'fx2assignDeck1': 0x50,
        'shiftFx2assignDeck1': 0x54,
        'fx2assignDeck2': 0x51,
        'shiftFx2assignDeck2': 0x55,
        'fx2assignDeck3': 0x52,
        'shiftFx2assignDeck3': 0x56,
        'fx2assignDeck4': 0x53,
        'shiftFx2assignDeck4': 0x57,
        'masterCue': 0x63,
        'shiftMasterCue': 0x62,
        'loadDeck1': 0x46,
        'shiftLoadDeck1': 0x58,
        'loadDeck2': 0x47,
        'shiftLoadDeck2': 0x59,
        'loadDeck3': 0x48,
        'shiftLoadDeck3': 0x60,
        'loadDeck4': 0x49,
        'shiftLoadDeck4': 0x61,
        'hotCueMode': 0x1B,
        'shiftHotCueMode': 0x69,
        'rollMode': 0x1E,
        'shiftRollMode': 0x6B,
        'slicerMode': 0x20,
        'shiftSlicerMode': 0x6D,
        'samplerMode': 0x22,
        'shiftSamplerMode': 0x6F,
        'longPressSamplerMode': 0x41,
        'parameterLeftHotCueMode': 0x24,
        'shiftParameterLeftHotCueMode': 0x01,
        'parameterLeftRollMode': 0x25,
        'shiftParameterLeftRollMode': 0x02,
        'parameterLeftSlicerMode': 0x26,
        'shiftParameterLeftSlicerMode': 0x03,
        'parameterLeftSamplerMode': 0x27,
        'shiftParameterLeftSamplerMode': 0x04,
        'parameterLeftGroup1Mode': 0x28,
        'shiftParameterLeftGroup1Mode': 0x05,
        'parameterLeftGroup2Mode': 0x29,
        'shiftParameterLeftGroup2Mode': 0x06,
        'parameterLeftGroup3Mode': 0x2A,
        'shiftParameterLeftGroup3Mode': 0x07,
        'parameterLeftGroup4Mode': 0x2B,
        'shiftParameterLeftGroup4Mode': 0x08,
        'parameterRightHotCueMode': 0x2C,
        'shiftParameterRightHotCueMode': 0x09,
        'parameterRightRollMode': 0x2D,
        'shiftParameterRightRollMode': 0x7A,
        'parameterRightSlicerMode': 0x2E,
        'shiftParameterRightSlicerMode': 0x7B,
        'parameterRightSamplerMode': 0x2F,
        'shiftParameterRightSamplerMode': 0x7C,
        'parameterRightGroup1Mode': 0x30,
        'shiftParameterRightGroup1Mode': 0x7D,
        'parameterRightGroup2Mode': 0x31,
        'shiftParameterRightGroup2Mode': 0x7E,
        'parameterRightGroup3Mode': 0x32,
        'shiftParameterRightGroup3Mode': 0x7F,
        'parameterRightGroup4Mode': 0x33,
        'shiftParameterRightGroup4Mode': 0x00
    };

    PioneerDDJSXRevamp.illuminationControl = {
        'loadedDeck1': 0x00,
        'loadedDeck2': 0x01,
        'loadedDeck3': 0x02,
        'loadedDeck4': 0x03,
        'unknownDeck1': 0x04,
        'unknownDeck2': 0x05,
        'unknownDeck3': 0x06,
        'unknownDeck4': 0x07,
        'playPauseDeck1': 0x0C,
        'playPauseDeck2': 0x0D,
        'playPauseDeck3': 0x0E,
        'playPauseDeck4': 0x0F,
        'cueDeck1': 0x10,
        'cueDeck2': 0x11,
        'cueDeck3': 0x12,
        'cueDeck4': 0x13,
        'djAppConnect': 0x09
    };

    PioneerDDJSXRevamp.wheelLedCircle = {
        'minVal': 0x00,
        'maxVal': 0x48
    };

    PioneerDDJSXRevamp.valueVuMeter = {
        '[Channel1]_current': 0,
        '[Channel2]_current': 0,
        '[Channel3]_current': 0,
        '[Channel4]_current': 0,
        '[Channel1]_enabled': 1,
        '[Channel2]_enabled': 1,
        '[Channel3]_enabled': 1,
        '[Channel4]_enabled': 1
    };

    // set 32 Samplers as default:
    engine.setValue("[Master]", "num_samplers", 32);

    // activate vu meter timer for Auto DJ:
    if (PioneerDDJSXRevamp.twinkleVumeterAutodjOn) {
        PioneerDDJSXRevamp.vuMeterTimer = engine.beginTimer(200, "PioneerDDJSXRevamp.vuMeterTwinkle()");
    }

    // initiate control status request:
    midi.sendShortMsg(0x9B, 0x08, 0x7F);

    // bind controls and init deck parameters:
    PioneerDDJSXRevamp.bindNonDeckControlConnections(true);
    for (var index in PioneerDDJSXRevamp.channelGroups) {
        if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(index)) {
            PioneerDDJSXRevamp.initDeck(index);
        }
    }

    // init effects section:
    PioneerDDJSXRevamp.effectUnit = [];
    PioneerDDJSXRevamp.effectUnit[1] = new components.EffectUnit([1, 3]);
    PioneerDDJSXRevamp.effectUnit[2] = new components.EffectUnit([2, 4]);
    PioneerDDJSXRevamp.effectUnit[1].enableButtons[1].midi = [0x94, PioneerDDJSXRevamp.nonPadLeds.fx1on];
    PioneerDDJSXRevamp.effectUnit[1].enableButtons[2].midi = [0x94, PioneerDDJSXRevamp.nonPadLeds.fx2on];
    PioneerDDJSXRevamp.effectUnit[1].enableButtons[3].midi = [0x94, PioneerDDJSXRevamp.nonPadLeds.fx3on];
    PioneerDDJSXRevamp.effectUnit[1].effectFocusButton.midi = [0x94, PioneerDDJSXRevamp.nonPadLeds.fxTab];
    PioneerDDJSXRevamp.effectUnit[1].dryWetKnob.input = function(channel, control, value, status, group) {
        this.inSetParameter(this.inGetParameter() + PioneerDDJSXRevamp.getRotaryDelta(value) / 30);
    };
    PioneerDDJSXRevamp.effectUnit[1].init();
    PioneerDDJSXRevamp.effectUnit[2].enableButtons[1].midi = [0x95, PioneerDDJSXRevamp.nonPadLeds.fx1on];
    PioneerDDJSXRevamp.effectUnit[2].enableButtons[2].midi = [0x95, PioneerDDJSXRevamp.nonPadLeds.fx2on];
    PioneerDDJSXRevamp.effectUnit[2].enableButtons[3].midi = [0x95, PioneerDDJSXRevamp.nonPadLeds.fx3on];
    PioneerDDJSXRevamp.effectUnit[2].effectFocusButton.midi = [0x95, PioneerDDJSXRevamp.nonPadLeds.fxTab];
    PioneerDDJSXRevamp.effectUnit[2].dryWetKnob.input = function(channel, control, value, status, group) {
        this.inSetParameter(this.inGetParameter() + PioneerDDJSXRevamp.getRotaryDelta(value) / 30);
    };
    PioneerDDJSXRevamp.effectUnit[2].init();
};

PioneerDDJSXRevamp.shutdown = function() {
    PioneerDDJSXRevamp.resetDeck("[Channel1]");
    PioneerDDJSXRevamp.resetDeck("[Channel2]");
    PioneerDDJSXRevamp.resetDeck("[Channel3]");
    PioneerDDJSXRevamp.resetDeck("[Channel4]");

    PioneerDDJSXRevamp.resetNonDeckLeds();
};


///////////////////////////////////////////////////////////////
//                      VU - METER                           //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.vuMeterTwinkle = function() {
    if (engine.getValue("[AutoDJ]", "enabled")) {
        PioneerDDJSXRevamp.blinkAutodjState = !PioneerDDJSXRevamp.blinkAutodjState;
    }
    PioneerDDJSXRevamp.valueVuMeter["[Channel1]_enabled"] = PioneerDDJSXRevamp.blinkAutodjState ? 1 : 0;
    PioneerDDJSXRevamp.valueVuMeter["[Channel3]_enabled"] = PioneerDDJSXRevamp.blinkAutodjState ? 1 : 0;
    PioneerDDJSXRevamp.valueVuMeter["[Channel2]_enabled"] = PioneerDDJSXRevamp.blinkAutodjState ? 1 : 0;
    PioneerDDJSXRevamp.valueVuMeter["[Channel4]_enabled"] = PioneerDDJSXRevamp.blinkAutodjState ? 1 : 0;
};


///////////////////////////////////////////////////////////////
//                        AUTO DJ                            //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.autodjToggle = function(channel, control, value, status, group) {
    if (value) {
        script.toggleControl("[AutoDJ]", "enabled");
    }
};

PioneerDDJSXRevamp.autoDJToggleSyncBPM = function(channel, control, value, status, group) {
    if (value) {
        PioneerDDJSXRevamp.autoDJSyncBPM = !PioneerDDJSXRevamp.autoDJSyncBPM;
        PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftLoadDeck1, PioneerDDJSXRevamp.autoDJSyncBPM);
    }
};

PioneerDDJSXRevamp.autoDJToggleSyncKey = function(channel, control, value, status, group) {
    if (value) {
        PioneerDDJSXRevamp.autoDJSyncKey = !PioneerDDJSXRevamp.autoDJSyncKey;
        PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftLoadDeck2, PioneerDDJSXRevamp.autoDJSyncKey);
    }
};

PioneerDDJSXRevamp.autoDJTimer = function(value, group, control) {
    if (value) {
        PioneerDDJSXRevamp.autoDJTickTimer = engine.beginTimer(PioneerDDJSXRevamp.autoDJTickInterval, "PioneerDDJSXRevamp.autoDJControl()");
    } else if (PioneerDDJSXRevamp.autoDJTickTimer) {
        engine.stopTimer(PioneerDDJSXRevamp.autoDJTickTimer);
        PioneerDDJSXRevamp.autoDJTickTimer = 0;
    }
    engine.setValue("[Channel1]", "quantize", value);
    engine.setValue("[Channel2]", "quantize", value);
};

PioneerDDJSXRevamp.autoDJControl = function() {
    var prev = 1,
        next = 2,
        prevPos = 0,
        nextPos = 0,
        nextPlaying = 0,
        prevBpm = 0,
        nextBpm = 0,
        diffBpm = 0,
        diffBpmDouble = 0,
        keyOkay = 0,
        prevKey = 0,
        nextKey = 0,
        diffKey = 0;

    if (!PioneerDDJSXRevamp.autoDJSyncBPM && !PioneerDDJSXRevamp.autoDJSyncKey) {
        return;
    }

    prevPos = engine.getValue("[Channel" + prev + "]", "playposition");
    nextPos = engine.getValue("[Channel" + next + "]", "playposition");
    if (prevPos < nextPos) {
        var tmp = nextPos;
        nextPos = prevPos;
        prevPos = tmp;
        next = 1;
        prev = 2;
    }
    nextPlaying = engine.getValue("[Channel" + next + "]", "play_indicator");
    prevBpm = engine.getValue("[Channel" + prev + "]", "visual_bpm");
    nextBpm = engine.getValue("[Channel" + next + "]", "visual_bpm");
    diffBpm = Math.abs(nextBpm - prevBpm);
    // diffBpm, with bpm of ONE track doubled
    // Note: Where appropriate, Mixxx will automatically match two beats of one.
    if (nextBpm < prevBpm) {
        diffBpmDouble = Math.abs(2 * nextBpm - prevBpm);
    } else {
        diffBpmDouble = Math.abs(2 * prevBpm - nextBpm);
    }

    // Next track is playing --> Fade in progress
    // Note: play_indicator is falsely true, when analysis is needed and similar
    if (nextPlaying && (nextPos > 0.0)) {
        // Bpm synced up --> disable sync before new track loaded
        // Note: Sometimes, Mixxx does not sync close enough for === operator
        if (diffBpm < 0.01 || diffBpmDouble < 0.01) {
            engine.setValue("[Channel" + prev + "]", "sync_mode", 0.0);
            engine.setValue("[Channel" + next + "]", "sync_mode", 0.0);
        } else { // Synchronize
            engine.setValue("[Channel" + prev + "]", "sync_mode", 1.0); // First,  set prev to follower
            engine.setValue("[Channel" + next + "]", "sync_mode", 2.0); // Second, set next to master
        }

        // Only adjust key when approaching the middle of fading
        if (PioneerDDJSXRevamp.autoDJSyncKey) {
            var diffFader = Math.abs(engine.getValue("[Master]", "crossfader") - 0.5);
            if (diffFader < 0.25) {
                nextKey = engine.getValue("[Channel" + next + "]", "key");
                engine.setValue("[Channel" + prev + "]", "key", nextKey);
            }
        }
    } else if (!nextPlaying) { // Next track is stopped --> Disable sync and refine track selection
        // First, disable sync; should be off by now, anyway
        engine.setValue("[Channel" + prev + "]", "sync_mode", 0.0); // Disable sync, else loading new track...
        engine.setValue("[Channel" + next + "]", "sync_mode", 0.0); // ...or skipping tracks would break things.

        // Second, refine track selection
        var skip = 0;
        if (diffBpm > PioneerDDJSXRevamp.autoDJMaxBpmAdjustment && diffBpmDouble > PioneerDDJSXRevamp.autoDJMaxBpmAdjustment) {
            skip = 1;
        }
        // Mixing in key:
        //     1  the difference is exactly 12 (harmonic switch of tonality), or
        //     2  both are of same tonality, and
        //     2a difference is 0, 1 or 2 (difference of up to two semitones: equal key or energy mix)
        //     2b difference corresponds to neighbours in the circle of fifth (harmonic neighbours)
        //   If neither is the case, we skip.
        if (PioneerDDJSXRevamp.autoDJSyncKey) {
            keyOkay = 0;
            prevKey = engine.getValue("[Channel" + prev + "]", "visual_key");
            nextKey = engine.getValue("[Channel" + next + "]", "visual_key");
            diffKey = Math.abs(prevKey - nextKey);
            if (diffKey === 12.0) {
                keyOkay = 1; // Switch of tonality
            }
            // Both of same tonality:
            if ((prevKey < 13 && nextKey < 13) || (prevKey > 12 && nextKey > 12)) {
                if (diffKey < 3.0) {
                    keyOkay = 1; // Equal or Energy
                }
                if (diffKey === 5.0 || diffKey === 7.0) {
                    keyOkay = 1; // Neighbours in Circle of Fifth
                }
            }
            if (!keyOkay) {
                skip = 1;
            }
        }

        if (skip) {
            engine.setValue("[AutoDJ]", "skip_next", 1.0);
            engine.setValue("[AutoDJ]", "skip_next", 0.0); // Have to reset manually
            if (PioneerDDJSXRevamp.autoDJShuffleAfterSkip) {
                engine.setValue("[AutoDJ]", "shuffle_playlist", 1.0);
                engine.setValue("[AutoDJ]", "shuffle_playlist", 0.0); // Have to reset manually
            }
        }
    }
};


///////////////////////////////////////////////////////////////
//                      CONTROL BINDING                      //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.bindDeckControlConnections = function(channelGroup, bind) {
    var i,
        index,
        deck = PioneerDDJSXRevamp.channelGroups[channelGroup],
        controlsToFunctions = {
            'play_indicator': 'PioneerDDJSXRevamp.playLed',
            'cue_indicator': 'PioneerDDJSXRevamp.cueLed',
            'playposition': 'PioneerDDJSXRevamp.wheelLeds',
            'pfl': 'PioneerDDJSXRevamp.headphoneCueLed',
            'bpm_tap': 'PioneerDDJSXRevamp.shiftHeadphoneCueLed',
            'VuMeter': 'PioneerDDJSXRevamp.VuMeterLeds',
            'keylock': 'PioneerDDJSXRevamp.keyLockLed',
            'slip_enabled': 'PioneerDDJSXRevamp.slipLed',
            'quantize': 'PioneerDDJSXRevamp.quantizeLed',
            'loop_in': 'PioneerDDJSXRevamp.loopInLed',
            'loop_out': 'PioneerDDJSXRevamp.loopOutLed',
            'loop_enabled': 'PioneerDDJSXRevamp.autoLoopLed',
            'loop_double': 'PioneerDDJSXRevamp.loopDoubleLed',
            'loop_halve': 'PioneerDDJSXRevamp.loopHalveLed',
            'reloop_andstop': 'PioneerDDJSXRevamp.shiftLoopInLed',
            'beatjump_1_forward': 'PioneerDDJSXRevamp.loopShiftFWLed',
            'beatjump_1_backward': 'PioneerDDJSXRevamp.loopShiftBKWLed',
            'beatjump_forward': 'PioneerDDJSXRevamp.hotCueParameterRightLed',
            'beatjump_backward': 'PioneerDDJSXRevamp.hotCueParameterLeftLed',
            'reverse': 'PioneerDDJSXRevamp.reverseLed',
            'duration': 'PioneerDDJSXRevamp.loadLed',
            'sync_enabled': 'PioneerDDJSXRevamp.syncLed',
            'beat_active': 'PioneerDDJSXRevamp.slicerBeatActive'
        };

    for (i = 1; i <= 8; i++) {
        controlsToFunctions["hotcue_" + i + "_enabled"] = "PioneerDDJSXRevamp.hotCueLeds";
    }

    for (index in PioneerDDJSXRevamp.selectedLoopIntervals[deck]) {
        if (PioneerDDJSXRevamp.selectedLoopIntervals[deck].hasOwnProperty(index)) {
            controlsToFunctions["beatloop_" + PioneerDDJSXRevamp.selectedLoopIntervals[deck][index] + "_enabled"] = "PioneerDDJSXRevamp.beatloopLeds";
        }
    }

    for (index in PioneerDDJSXRevamp.selectedLooprollIntervals[deck]) {
        if (PioneerDDJSXRevamp.selectedLooprollIntervals[deck].hasOwnProperty(index)) {
            controlsToFunctions["beatlooproll_" + PioneerDDJSXRevamp.selectedLooprollIntervals[deck][index] + "_activate"] = "PioneerDDJSXRevamp.beatlooprollLeds";
        }
    }

    script.bindConnections(channelGroup, controlsToFunctions, !bind);

    for (index in PioneerDDJSXRevamp.fxUnitGroups) {
        if (PioneerDDJSXRevamp.fxUnitGroups.hasOwnProperty(index)) {
            if (PioneerDDJSXRevamp.fxUnitGroups[index] < 2) {
                engine.connectControl(index, "group_" + channelGroup + "_enable", "PioneerDDJSXRevamp.fxAssignLeds", !bind);
                if (bind) {
                    engine.trigger(index, "group_" + channelGroup + "_enable");
                }
            }
        }
    }
};

PioneerDDJSXRevamp.bindNonDeckControlConnections = function(bind) {
    var index;

    for (index in PioneerDDJSXRevamp.samplerGroups) {
        if (PioneerDDJSXRevamp.samplerGroups.hasOwnProperty(index)) {
            engine.connectControl(index, "duration", "PioneerDDJSXRevamp.samplerLeds", !bind);
            engine.connectControl(index, "play", "PioneerDDJSXRevamp.samplerLedsPlay", !bind);
            if (bind) {
                engine.trigger(index, "duration");
            }
        }
    }

    engine.connectControl("[Master]", "headSplit", "PioneerDDJSXRevamp.shiftMasterCueLed", !bind);
    if (bind) {
        engine.trigger("[Master]", "headSplit");
    }

    engine.connectControl("[AutoDJ]", "enabled", "PioneerDDJSXRevamp.autoDJTimer", !bind);
};


///////////////////////////////////////////////////////////////
//                     DECK INIT / RESET                     //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.initDeck = function(group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];

    // save set up speed slider range from the Mixxx settings:
    PioneerDDJSXRevamp.setUpSpeedSliderRange[deck] = engine.getValue(group, "rateRange");

    PioneerDDJSXRevamp.bindDeckControlConnections(group, true);

    PioneerDDJSXRevamp.updateParameterStatusLeds(
        group,
        PioneerDDJSXRevamp.selectedLoopRollParam[deck],
        PioneerDDJSXRevamp.selectedLoopParam[deck],
        PioneerDDJSXRevamp.selectedSamplerBank,
        PioneerDDJSXRevamp.selectedSlicerQuantizeParam[deck],
        PioneerDDJSXRevamp.selectedSlicerDomainParam[deck]
    );
    PioneerDDJSXRevamp.triggerVinylLed(deck);

    PioneerDDJSXRevamp.illuminateFunctionControl(
        PioneerDDJSXRevamp.illuminationControl["loadedDeck" + (deck + 1)],
        false
    );
    PioneerDDJSXRevamp.illuminateFunctionControl(
        PioneerDDJSXRevamp.illuminationControl["unknownDeck" + (deck + 1)],
        false
    );
    PioneerDDJSXRevamp.wheelLedControl(group, PioneerDDJSXRevamp.wheelLedCircle.minVal);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.hotCueMode, true); // set HOT CUE Pad-Mode

    engine.setValue(group, "beatjump_size", 16);
};

PioneerDDJSXRevamp.resetDeck = function(group) {
    PioneerDDJSXRevamp.bindDeckControlConnections(group, false);

    PioneerDDJSXRevamp.VuMeterLeds(0x00, group, 0x00); // reset VU meter Leds
    PioneerDDJSXRevamp.wheelLedControl(group, PioneerDDJSXRevamp.wheelLedCircle.minVal); // reset jogwheel Leds
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.hotCueMode, true); // reset HOT CUE Pad-Mode
    // pad Leds:
    for (var i = 0; i < 8; i++) {
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.hotCue, i, false, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.loopRoll, i, false, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.slicer, i, false, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.sampler, i, false, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.group2, i, false, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.hotCue, i, true, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.loopRoll, i, true, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.slicer, i, true, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.sampler, i, true, false);
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.group2, i, true, false);
    }
    // non pad Leds:
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.headphoneCue, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftHeadphoneCue, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.cue, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftCue, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.keyLock, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftKeyLock, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.play, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftPlay, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.vinyl, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.sync, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftSync, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.autoLoop, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftAutoLoop, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.loopHalve, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftLoopHalve, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.loopIn, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftLoopIn, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.loopOut, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftLoopOut, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.censor, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftCensor, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.slip, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftSlip, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.gridAdjust, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftGridAdjust, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.gridSlide, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftGridSlide, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverPlus, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverMinus, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftRollMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftSlicerMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftParameterLeftSlicerMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftSamplerMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftGroup2Mode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightRollMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightSlicerMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftParameterRightSlicerMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightSamplerMode, false);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightGroup2Mode, false);
};


///////////////////////////////////////////////////////////////
//            HIGH RESOLUTION MIDI INPUT HANDLERS            //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.highResMSB = {
    '[Channel1]': {},
    '[Channel2]': {},
    '[Channel3]': {},
    '[Channel4]': {},
    '[Master]': {},
    '[Samplers]': {}
};

PioneerDDJSXRevamp.tempoSliderMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].tempoSlider = value;
};

PioneerDDJSXRevamp.tempoSliderLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].tempoSlider << 7) + value,
        sliderRate = 1 - (fullValue / 0x3FFF),
        deck = PioneerDDJSXRevamp.channelGroups[group];

    engine.setParameter(group, "rate", sliderRate);

    if (PioneerDDJSXRevamp.syncRate[deck] !== 0) {
        if (PioneerDDJSXRevamp.syncRate[deck] !== engine.getValue(group, "rate")) {
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverPlus, 0);
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverMinus, 0);
            PioneerDDJSXRevamp.syncRate[deck] = 0;
        }
    }
};

PioneerDDJSXRevamp.gainKnobMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].gainKnob = value;
};

PioneerDDJSXRevamp.gainKnobLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].gainKnob << 7) + value;
    engine.setParameter(group, "pregain", fullValue / 0x3FFF);
};

PioneerDDJSXRevamp.filterHighKnobMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].filterHigh = value;
};

PioneerDDJSXRevamp.filterHighKnobLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].filterHigh << 7) + value;
    engine.setParameter("[EqualizerRack1_" + group + "_Effect1]", "parameter3", fullValue / 0x3FFF);
};

PioneerDDJSXRevamp.filterMidKnobMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].filterMid = value;
};

PioneerDDJSXRevamp.filterMidKnobLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].filterMid << 7) + value;
    engine.setParameter("[EqualizerRack1_" + group + "_Effect1]", "parameter2", fullValue / 0x3FFF);
};

PioneerDDJSXRevamp.filterLowKnobMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].filterLow = value;
};

PioneerDDJSXRevamp.filterLowKnobLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].filterLow << 7) + value;
    engine.setParameter("[EqualizerRack1_" + group + "_Effect1]", "parameter1", fullValue / 0x3FFF);
};

PioneerDDJSXRevamp.deckFaderMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].deckFader = value;
};

PioneerDDJSXRevamp.deckFaderLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].deckFader << 7) + value;

    if (PioneerDDJSXRevamp.shiftPressed &&
        engine.getValue(group, "volume") === 0 &&
        fullValue !== 0 &&
        engine.getValue(group, "play") === 0
       ) {
        PioneerDDJSXRevamp.chFaderStart[channel] = engine.getValue(group, "playposition");
        engine.setValue(group, "play", 1);
    } else if (
        PioneerDDJSXRevamp.shiftPressed &&
            engine.getValue(group, "volume") !== 0 &&
            fullValue === 0 &&
            engine.getValue(group, "play") === 1 &&
            PioneerDDJSXRevamp.chFaderStart[channel] !== null
    ) {
        engine.setValue(group, "play", 0);
        engine.setValue(group, "playposition", PioneerDDJSXRevamp.chFaderStart[channel]);
        PioneerDDJSXRevamp.chFaderStart[channel] = null;
    }
    engine.setParameter(group, "volume", fullValue / 0x3FFF);
};

PioneerDDJSXRevamp.filterKnobMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].filterKnob = value;
};

PioneerDDJSXRevamp.filterKnobLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].filterKnob << 7) + value;
    engine.setParameter("[QuickEffectRack1_" + group + "]", "super1", fullValue / 0x3FFF);
};

PioneerDDJSXRevamp.crossfaderCurveKnobMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].crossfaderCurveKnob = value;
};

PioneerDDJSXRevamp.crossfaderCurveKnobLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].crossfaderCurveKnob << 7) + value;
    script.crossfaderCurve(fullValue, 0x00, 0x3FFF);
};

PioneerDDJSXRevamp.samplerVolumeFaderMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].samplerVolumeFader = value;
};

PioneerDDJSXRevamp.samplerVolumeFaderLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].samplerVolumeFader << 7) + value;
    for (var i = 1; i <= 32; i++) {
        engine.setParameter("[Sampler" + i + "]", "volume", fullValue / 0x3FFF);
    }
};

PioneerDDJSXRevamp.crossFaderMSB = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.highResMSB[group].crossFader = value;
};

PioneerDDJSXRevamp.crossFaderLSB = function(channel, control, value, status, group) {
    var fullValue = (PioneerDDJSXRevamp.highResMSB[group].crossFader << 7) + value;
    engine.setParameter(group, "crossfader", fullValue / 0x3FFF);
};


///////////////////////////////////////////////////////////////
//           SINGLE MESSAGE MIDI INPUT HANDLERS              //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.shiftButton = function(channel, control, value, status, group) {
    var index = 0;
    PioneerDDJSXRevamp.shiftPressed = (value === 0x7F);
    for (index in PioneerDDJSXRevamp.chFaderStart) {
        if (typeof index === "number") {
            PioneerDDJSXRevamp.chFaderStart[index] = null;
        }
    }
    if (value) {
        PioneerDDJSXRevamp.effectUnit[1].shift();
        PioneerDDJSXRevamp.effectUnit[2].shift();
    }
    if (!value) {
        PioneerDDJSXRevamp.effectUnit[1].unshift();
        PioneerDDJSXRevamp.effectUnit[2].unshift();
    }
};

PioneerDDJSXRevamp.playButton = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group],
        playing = engine.getValue(group, "play");

    if (value) {
        if (playing) {
            script.brake(channel, control, value, status, group);
            PioneerDDJSXRevamp.toggledBrake[deck] = true;
        } else {
            script.toggleControl(group, "play");
        }
    } else {
        if (PioneerDDJSXRevamp.toggledBrake[deck]) {
            script.brake(channel, control, value, status, group);
            script.toggleControl(group, "play");
            PioneerDDJSXRevamp.toggledBrake[deck] = false;
        }
    }
};

PioneerDDJSXRevamp.playStutterButton = function(channel, control, value, status, group) {
    engine.setValue(group, "play_stutter", value ? 1 : 0);
};

PioneerDDJSXRevamp.cueButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "cue_default");
};

PioneerDDJSXRevamp.Deck1SelectButton = function(channel, control, value, status, group) {

}

PioneerDDJSXRevamp.Deck3SelectButton = function(channel, control, value, status, group) {

}

PioneerDDJSXRevamp.Deck13DualButton = function(channel, control, value, status, group) {

}

PioneerDDJSXRevamp.Deck2SelectButton = function(channel, control, value, status, group) {

}

PioneerDDJSXRevamp.Deck4SelectButton = function(channel, control, value, status, group) {

}

PioneerDDJSXRevamp.Deck24DualButton = function(channel, control, value, status, group) {

}

PioneerDDJSXRevamp.jumpToBeginningButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "start_stop");
};

PioneerDDJSXRevamp.headphoneCueButton = function(channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, "pfl");
    }
};

PioneerDDJSXRevamp.headphoneShiftCueButton = function(channel, control, value, status, group) {
    if (value) {
        bpm.tapButton(PioneerDDJSXRevamp.channelGroups[group] + 1);
    }
};

PioneerDDJSXRevamp.headphoneSplitCueButton = function(channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, "headSplit");
    }
};

PioneerDDJSXRevamp.toggleHotCueMode = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    //HOTCUE
    if (value) {
        PioneerDDJSXRevamp.activePadMode[deck] = PioneerDDJSXRevamp.padModes.hotCue;
        PioneerDDJSXRevamp.activeSlicerMode[deck] = PioneerDDJSXRevamp.slicerModes.contSlice;
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.hotCueMode, value);
    }
};

PioneerDDJSXRevamp.toggleBeatloopRollMode = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    //ROLL
    if (value) {
        PioneerDDJSXRevamp.activePadMode[deck] = PioneerDDJSXRevamp.padModes.loopRoll;
        PioneerDDJSXRevamp.activeSlicerMode[deck] = PioneerDDJSXRevamp.slicerModes.contSlice;
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.rollMode, value);
    }
};

PioneerDDJSXRevamp.toggleSlicerMode = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    //SLICER
    if (value) {
        if (PioneerDDJSXRevamp.activePadMode[deck] === PioneerDDJSXRevamp.padModes.slicer &&
            PioneerDDJSXRevamp.activeSlicerMode[deck] === PioneerDDJSXRevamp.slicerModes.contSlice) {
            PioneerDDJSXRevamp.activeSlicerMode[deck] = PioneerDDJSXRevamp.slicerModes.loopSlice;
            engine.setValue(group, "slip_enabled", true);
        } else {
            PioneerDDJSXRevamp.activeSlicerMode[deck] = PioneerDDJSXRevamp.slicerModes.contSlice;
            engine.setValue(group, "slip_enabled", false);
        }
        PioneerDDJSXRevamp.activePadMode[deck] = PioneerDDJSXRevamp.padModes.slicer;
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.slicerMode, value);
    }
};

PioneerDDJSXRevamp.toggleSamplerMode = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    //SAMPLER
    if (value) {
        PioneerDDJSXRevamp.activePadMode[deck] = PioneerDDJSXRevamp.padModes.sampler;
        PioneerDDJSXRevamp.activeSlicerMode[deck] = PioneerDDJSXRevamp.slicerModes.contSlice;
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.samplerMode, value);
    }
};

PioneerDDJSXRevamp.toggleSamplerVelocityMode = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group],
        index = 0;
    PioneerDDJSXRevamp.samplerVelocityMode[deck] = value ? true : false;
    if (value) {
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.longPressSamplerMode, value);
        for (index = 1; index <= 32; index++) {
            engine.setParameter("[Sampler" + index + "]", "volume", 0);
        }
    } else {
        for (index = 1; index <= 32; index++) {
            engine.setParameter("[Sampler" + index + "]", "volume", 1);
        }
    }
};

PioneerDDJSXRevamp.toggleBeatloopMode = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    //GROUP2
    if (value) {
        PioneerDDJSXRevamp.activePadMode[deck] = PioneerDDJSXRevamp.padModes.beatloop;
        PioneerDDJSXRevamp.activeSlicerMode[deck] = PioneerDDJSXRevamp.slicerModes.contSlice;
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftRollMode, value);
    }
};

PioneerDDJSXRevamp.hotCueButtons = function(channel, control, value, status, group) {
    var index = control + 1;
    script.toggleControl(group, "hotcue_" + index + "_activate");
};

PioneerDDJSXRevamp.clearHotCueButtons = function(channel, control, value, status, group) {
    var index = control - 0x08 + 1;
    script.toggleControl(group, "hotcue_" + index + "_clear");
};

PioneerDDJSXRevamp.beatloopButtons = function(channel, control, value, status, group) {
    var index = control - 0x50,
        deck = PioneerDDJSXRevamp.channelGroups[group];
    script.toggleControl(
        group,
        "beatloop_" + PioneerDDJSXRevamp.selectedLoopIntervals[deck][index] + "_toggle"
    );
};

PioneerDDJSXRevamp.slicerButtons = function(channel, control, value, status, group) {
    var index = control - 0x20,
        deck = PioneerDDJSXRevamp.channelGroups[group],
        domain = PioneerDDJSXRevamp.selectedSlicerDomain[deck],
        beatsToJump = 0;

    if (PioneerDDJSXRevamp.activeSlicerMode[deck] === PioneerDDJSXRevamp.slicerModes.loopSlice) {
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.slicer, index, false, !value);
    } else {
        PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.slicer, index, false, value);
    }
    PioneerDDJSXRevamp.slicerActive[deck] = value ? true : false;
    PioneerDDJSXRevamp.slicerButton[deck] = index;

    if (value) {
        beatsToJump = (PioneerDDJSXRevamp.slicerButton[deck] * (domain / 8)) - ((PioneerDDJSXRevamp.slicerBeatsPassed[deck] % domain) + 1);
        if (PioneerDDJSXRevamp.slicerButton[deck] === 0 && beatsToJump === -domain) {
            beatsToJump = 0;
        }
        if (PioneerDDJSXRevamp.slicerBeatsPassed[deck] >= Math.abs(beatsToJump) &&
            PioneerDDJSXRevamp.slicerPreviousBeatsPassed[deck] !== PioneerDDJSXRevamp.slicerBeatsPassed[deck]) {
            PioneerDDJSXRevamp.slicerPreviousBeatsPassed[deck] = PioneerDDJSXRevamp.slicerBeatsPassed[deck];
            if (Math.abs(beatsToJump) > 0) {
                engine.setValue(group, "beatjump", beatsToJump);
            }
        }
    }

    if (PioneerDDJSXRevamp.activeSlicerMode[deck] === PioneerDDJSXRevamp.slicerModes.contSlice) {
        engine.setValue(group, "slip_enabled", value);
        engine.setValue(group, "beatloop_size", PioneerDDJSXRevamp.selectedSlicerQuantization[deck]);
        engine.setValue(group, "beatloop_activate", value);
    }
};

PioneerDDJSXRevamp.beatloopRollButtons = function(channel, control, value, status, group) {
    var index = control - 0x10,
        deck = PioneerDDJSXRevamp.channelGroups[group];
    script.toggleControl(
        group,
        "beatlooproll_" + PioneerDDJSXRevamp.selectedLooprollIntervals[deck][index] + "_activate"
    );
};

PioneerDDJSXRevamp.samplerButtons = function(channel, control, value, status, group) {
    var index = control - 0x30 + 1,
        deckOffset = PioneerDDJSXRevamp.selectedSamplerBank * 8,
        sampleDeck = "[Sampler" + (index + deckOffset) + "]",
        playMode = PioneerDDJSXRevamp.samplerCueGotoAndPlay ? "cue_gotoandplay" : "start_play";

    if (engine.getValue(sampleDeck, "track_loaded")) {
        engine.setValue(sampleDeck, playMode, value ? 1 : 0);
    } else {
        engine.setValue(sampleDeck, "LoadSelectedTrack", value ? 1 : 0);
    }
};

PioneerDDJSXRevamp.stopSamplerButtons = function(channel, control, value, status, group) {
    var index = control - 0x38 + 1,
        deckOffset = PioneerDDJSXRevamp.selectedSamplerBank * 8,
        sampleDeck = "[Sampler" + (index + deckOffset) + "]",
        trackLoaded = engine.getValue(sampleDeck, "track_loaded"),
        playing = engine.getValue(sampleDeck, "play");

    if (trackLoaded && playing) {
        script.toggleControl(sampleDeck, "stop");
    } else if (trackLoaded && !playing && value) {
        script.toggleControl(sampleDeck, "eject");
    }
};

PioneerDDJSXRevamp.samplerVelocityVolume = function(channel, control, value, status, group) {
    var index = control - 0x30 + 1,
        deck = PioneerDDJSXRevamp.channelGroups[group],
        deckOffset = PioneerDDJSXRevamp.selectedSamplerBank * 8,
        sampleDeck = "[Sampler" + (index + deckOffset) + "]",
        vol = value / 0x7F;

    if (PioneerDDJSXRevamp.samplerVelocityMode[deck]) {
        engine.setParameter(sampleDeck, "volume", vol);
    }
};

PioneerDDJSXRevamp.changeParameters = function(group, ctrl, value) {
    var deck = PioneerDDJSXRevamp.channelGroups[group],
        index,
        offset = 0,
        samplerIndex = 0,
        beatjumpSize = 0;

    //Hot Cue Mode:
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftHotCueMode) {
        engine.setValue(group, "beatjump_backward", value);
    }
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightHotCueMode) {
        engine.setValue(group, "beatjump_forward", value);
    }
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.shiftParameterLeftHotCueMode) {
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftParameterLeftHotCueMode, value);
        if (value) {
            beatjumpSize = engine.getValue(group, "beatjump_size");
            engine.setValue(group, "beatjump_size", beatjumpSize / 2);
        }
    }
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.shiftParameterRightHotCueMode) {
        PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftParameterRightHotCueMode, value);
        if (value) {
            beatjumpSize = engine.getValue(group, "beatjump_size");
            engine.setValue(group, "beatjump_size", beatjumpSize * 2);
        }
    }

    // ignore other cases if button is released:
    if (!value) {
        return;
    }

    //Roll Mode:
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftRollMode || ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightRollMode) {
        // unbind previous connected controls:
        for (index in PioneerDDJSXRevamp.selectedLooprollIntervals[deck]) {
            if (PioneerDDJSXRevamp.selectedLooprollIntervals[deck].hasOwnProperty(index)) {
                engine.connectControl(
                    group,
                    "beatlooproll_" + PioneerDDJSXRevamp.selectedLooprollIntervals[deck][index] + "_activate",
                    "PioneerDDJSXRevamp.beatlooprollLeds",
                    true
                );
            }
        }
        // change parameter set:
        if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftRollMode && PioneerDDJSXRevamp.selectedLoopRollParam[deck] > 0) {
            PioneerDDJSXRevamp.selectedLoopRollParam[deck] -= 1;
        } else if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightRollMode && PioneerDDJSXRevamp.selectedLoopRollParam[deck] < 3) {
            PioneerDDJSXRevamp.selectedLoopRollParam[deck] += 1;
        }
        PioneerDDJSXRevamp.selectedLooprollIntervals[deck] = PioneerDDJSXRevamp.loopIntervals[PioneerDDJSXRevamp.selectedLoopRollParam[deck]];
        // bind new controls:
        for (index in PioneerDDJSXRevamp.selectedLooprollIntervals[deck]) {
            if (PioneerDDJSXRevamp.selectedLooprollIntervals[deck].hasOwnProperty(index)) {
                engine.connectControl(
                    group,
                    "beatlooproll_" + PioneerDDJSXRevamp.selectedLooprollIntervals[deck][index] + "_activate",
                    "PioneerDDJSXRevamp.beatlooprollLeds",
                    false
                );
            }
        }
    }

    //Group2 (Beatloop) Mode:
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftGroup2Mode || ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightGroup2Mode) {
        // unbind previous connected controls:
        for (index in PioneerDDJSXRevamp.selectedLoopIntervals[deck]) {
            if (PioneerDDJSXRevamp.selectedLoopIntervals[deck].hasOwnProperty(index)) {
                engine.connectControl(
                    group,
                    "beatloop_" + PioneerDDJSXRevamp.selectedLoopIntervals[deck][index] + "_enabled",
                    "PioneerDDJSXRevamp.beatloopLeds",
                    true
                );
            }
        }
        // change parameter set:
        if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftGroup2Mode && PioneerDDJSXRevamp.selectedLoopParam[deck] > 0) {
            PioneerDDJSXRevamp.selectedLoopParam[deck] -= 1;
        } else if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightGroup2Mode && PioneerDDJSXRevamp.selectedLoopParam[deck] < 3) {
            PioneerDDJSXRevamp.selectedLoopParam[deck] += 1;
        }
        PioneerDDJSXRevamp.selectedLoopIntervals[deck] = PioneerDDJSXRevamp.loopIntervals[PioneerDDJSXRevamp.selectedLoopParam[deck]];
        // bind new controls:
        for (index in PioneerDDJSXRevamp.selectedLoopIntervals[deck]) {
            if (PioneerDDJSXRevamp.selectedLoopIntervals[deck].hasOwnProperty(index)) {
                engine.connectControl(
                    group,
                    "beatloop_" + PioneerDDJSXRevamp.selectedLoopIntervals[deck][index] + "_enabled",
                    "PioneerDDJSXRevamp.beatloopLeds",
                    false
                );
            }
        }
    }

    //Sampler Mode:
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftSamplerMode || ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightSamplerMode) {
        // unbind previous connected controls:
        for (index in PioneerDDJSXRevamp.samplerGroups) {
            if (PioneerDDJSXRevamp.samplerGroups.hasOwnProperty(index)) {
                offset = PioneerDDJSXRevamp.selectedSamplerBank * 8;
                samplerIndex = (PioneerDDJSXRevamp.samplerGroups[index] + 1) + offset;
                engine.connectControl(
                    "[Sampler" + samplerIndex + "]",
                    "duration",
                    "PioneerDDJSXRevamp.samplerLeds",
                    true
                );
                engine.connectControl(
                    "[Sampler" + samplerIndex + "]",
                    "play",
                    "PioneerDDJSXRevamp.samplerLedsPlay",
                    true
                );
            }
        }
        // change sampler bank:
        if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftSamplerMode && PioneerDDJSXRevamp.selectedSamplerBank > 0) {
            PioneerDDJSXRevamp.selectedSamplerBank -= 1;
        } else if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightSamplerMode && PioneerDDJSXRevamp.selectedSamplerBank < 3) {
            PioneerDDJSXRevamp.selectedSamplerBank += 1;
        }
        // bind new controls:
        for (index in PioneerDDJSXRevamp.samplerGroups) {
            if (PioneerDDJSXRevamp.samplerGroups.hasOwnProperty(index)) {
                offset = PioneerDDJSXRevamp.selectedSamplerBank * 8;
                samplerIndex = (PioneerDDJSXRevamp.samplerGroups[index] + 1) + offset;
                engine.connectControl(
                    "[Sampler" + samplerIndex + "]",
                    "duration",
                    "PioneerDDJSXRevamp.samplerLeds",
                    false
                );
                engine.connectControl(
                    "[Sampler" + samplerIndex + "]",
                    "play",
                    "PioneerDDJSXRevamp.samplerLedsPlay",
                    false
                );
                engine.trigger("[Sampler" + samplerIndex + "]", "duration");
            }
        }
    }

    //Slicer Mode:
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftSlicerMode || ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightSlicerMode) {
        // change parameter set:
        if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterLeftSlicerMode && PioneerDDJSXRevamp.selectedSlicerQuantizeParam[deck] > 0) {
            PioneerDDJSXRevamp.selectedSlicerQuantizeParam[deck] -= 1;
        } else if (ctrl === PioneerDDJSXRevamp.nonPadLeds.parameterRightSlicerMode && PioneerDDJSXRevamp.selectedSlicerQuantizeParam[deck] < 3) {
            PioneerDDJSXRevamp.selectedSlicerQuantizeParam[deck] += 1;
        }
        PioneerDDJSXRevamp.selectedSlicerQuantization[deck] = PioneerDDJSXRevamp.slicerQuantizations[PioneerDDJSXRevamp.selectedSlicerQuantizeParam[deck]];
    }
    //Slicer Mode + SHIFT:
    if (ctrl === PioneerDDJSXRevamp.nonPadLeds.shiftParameterLeftSlicerMode || ctrl === PioneerDDJSXRevamp.nonPadLeds.shiftParameterRightSlicerMode) {
        // change parameter set:
        if (ctrl === PioneerDDJSXRevamp.nonPadLeds.shiftParameterLeftSlicerMode && PioneerDDJSXRevamp.selectedSlicerDomainParam[deck] > 0) {
            PioneerDDJSXRevamp.selectedSlicerDomainParam[deck] -= 1;
        } else if (ctrl === PioneerDDJSXRevamp.nonPadLeds.shiftParameterRightSlicerMode && PioneerDDJSXRevamp.selectedSlicerDomainParam[deck] < 3) {
            PioneerDDJSXRevamp.selectedSlicerDomainParam[deck] += 1;
        }
        PioneerDDJSXRevamp.selectedSlicerDomain[deck] = PioneerDDJSXRevamp.slicerDomains[PioneerDDJSXRevamp.selectedSlicerDomainParam[deck]];
    }

    // update parameter status leds:
    PioneerDDJSXRevamp.updateParameterStatusLeds(
        group,
        PioneerDDJSXRevamp.selectedLoopRollParam[deck],
        PioneerDDJSXRevamp.selectedLoopParam[deck],
        PioneerDDJSXRevamp.selectedSamplerBank,
        PioneerDDJSXRevamp.selectedSlicerQuantizeParam[deck],
        PioneerDDJSXRevamp.selectedSlicerDomainParam[deck]
    );
};

PioneerDDJSXRevamp.parameterLeft = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.changeParameters(group, control, value);
};

PioneerDDJSXRevamp.parameterRight = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.changeParameters(group, control, value);
};

PioneerDDJSXRevamp.shiftParameterLeft = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.changeParameters(group, control, value);
};

PioneerDDJSXRevamp.shiftParameterRight = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.changeParameters(group, control, value);
};

PioneerDDJSXRevamp.vinylButton = function(channel, control, value, status, group) {
    PioneerDDJSXRevamp.toggleScratch(channel, control, value, status, group);
};

PioneerDDJSXRevamp.slipButton = function(channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, "slip_enabled");
    }
};

PioneerDDJSXRevamp.keyLockButton = function(channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, "keylock");
    }
};

PioneerDDJSXRevamp.shiftKeyLockButton = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group],
        range = engine.getValue(group, "rateRange");

    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftKeyLock, value);

    // This mimics Serato's range settings and is less fumbly when switching back and forth between ranges.
    if (range === 0.08) {
        range = 0.16
    } else if (range === 0.16) {
        range = 0.50
    } else {
        range = 0.08
    }

    if (value) {
        engine.setValue(group, "rateRange", range);
    }
};

PioneerDDJSXRevamp.tempoResetButton = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    if (value) {
        engine.setValue(group, "rate", 0);
        if (PioneerDDJSXRevamp.syncRate[deck] !== engine.getValue(group, "rate")) {
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverPlus, 0);
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverMinus, 0);
            PioneerDDJSXRevamp.syncRate[deck] = 0;
        }
    }
};

PioneerDDJSXRevamp.autoLoopButton = function(channel, control, value, status, group) {
    if (value) {
        if (engine.getValue(group, "loop_enabled")) {
            engine.setValue(group, "reloop_toggle", true);
            engine.setValue(group, "reloop_toggle", false);
        } else {
            engine.setValue(group, "beatloop_activate", true);
            engine.setValue(group, "beatloop_activate", false);
        }
    }
};

PioneerDDJSXRevamp.loopActiveButton = function(channel, control, value, status, group) {
    engine.setValue(group, "reloop_toggle", value);
};

PioneerDDJSXRevamp.loopInButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "loop_in");
};

PioneerDDJSXRevamp.shiftLoopInButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "reloop_andstop");
};

PioneerDDJSXRevamp.loopOutButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "loop_out");
};

PioneerDDJSXRevamp.loopExitButton = function(channel, control, value, status, group) {
    engine.setValue(group, "reloop_toggle", value);
};

PioneerDDJSXRevamp.loopHalveButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "loop_halve");
};

PioneerDDJSXRevamp.loopDoubleButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "loop_double");
};

PioneerDDJSXRevamp.loopMoveBackButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "beatjump_1_backward");
};

PioneerDDJSXRevamp.loopMoveForwardButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "beatjump_1_forward");
};

PioneerDDJSXRevamp.loadButton = function(channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, "LoadSelectedTrack", true);
        if (PioneerDDJSXRevamp.autoPFL) {
            for (var index in PioneerDDJSXRevamp.channelGroups) {
                if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(index)) {
                    if (index === group) {
                        engine.setValue(index, "pfl", true);
                    } else {
                        engine.setValue(index, "pfl", false);
                    }
                }
            }
        }
    }
};

PioneerDDJSXRevamp.crossfaderAssignCenter = function(channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, "orientation", 1);
    }
};

PioneerDDJSXRevamp.crossfaderAssignLeft = function(channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, "orientation", 0);
    }
};

PioneerDDJSXRevamp.crossfaderAssignRight = function(channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, "orientation", 2);
    }
};

PioneerDDJSXRevamp.reverseRollButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "reverseroll");
};

PioneerDDJSXRevamp.reverseButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "reverse");
};

PioneerDDJSXRevamp.gridAdjustButton = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];

    PioneerDDJSXRevamp.gridAdjustSelected[deck] = value ? true : false;
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.gridAdjust, value);
};

PioneerDDJSXRevamp.gridSetButton = function(channel, control, value, status, group) {
    script.toggleControl(group, "beats_translate_curpos");
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftGridAdjust, value);
};

PioneerDDJSXRevamp.gridSlideButton = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];

    PioneerDDJSXRevamp.gridSlideSelected[deck] = value ? true : false;
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.gridSlide, value);
};

PioneerDDJSXRevamp.syncButton = function(channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, "sync_enabled");
    }
};

PioneerDDJSXRevamp.quantizeButton = function(channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, "quantize");
    }
};

PioneerDDJSXRevamp.needleSearchTouch = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    PioneerDDJSXRevamp.needleSearchTouched[deck] = value ? true : false;
    // if (engine.getValue(group, "play")) {
    //     PioneerDDJSXRevamp.needleSearchTouched[deck] = PioneerDDJSXRevamp.shiftPressed && (value ? true : false);
    // } else {
    //     PioneerDDJSXRevamp.needleSearchTouched[deck] = value ? true : false;
    // }
};

PioneerDDJSXRevamp.needleSearchStripPosition = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    if (PioneerDDJSXRevamp.needleSearchTouched[deck]) {
        var position = value / 0x7F;
        engine.setValue(group, "playposition", position);
    }
};

PioneerDDJSXRevamp.panelSelectButton = function(channel, control, value, status, group) {
    if (value) {
        if ((PioneerDDJSXRevamp.panels[0] === false) && (PioneerDDJSXRevamp.panels[1] === false)) {
            PioneerDDJSXRevamp.panels[0] = true;
        } else if ((PioneerDDJSXRevamp.panels[0] === true) && (PioneerDDJSXRevamp.panels[1] === false)) {
            PioneerDDJSXRevamp.panels[1] = true;
        } else if ((PioneerDDJSXRevamp.panels[0] === true) && (PioneerDDJSXRevamp.panels[1] === true)) {
            PioneerDDJSXRevamp.panels[0] = false;
        } else if ((PioneerDDJSXRevamp.panels[0] === false) && (PioneerDDJSXRevamp.panels[1] === true)) {
            PioneerDDJSXRevamp.panels[1] = false;
        }

        engine.setValue("[Samplers]", "show_samplers", PioneerDDJSXRevamp.panels[0]);
        engine.setValue("[EffectRack1]", "show", PioneerDDJSXRevamp.panels[1]);
    }
};

PioneerDDJSXRevamp.shiftPanelSelectButton = function(channel, control, value, status, group) {
    var channelGroup;
    PioneerDDJSXRevamp.shiftPanelSelectPressed = value ? true : false;

    for (var index in PioneerDDJSXRevamp.fxUnitGroups) {
        if (PioneerDDJSXRevamp.fxUnitGroups.hasOwnProperty(index)) {
            if (PioneerDDJSXRevamp.fxUnitGroups[index] < 2) {
                for (channelGroup in PioneerDDJSXRevamp.channelGroups) {
                    if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(channelGroup)) {
                        engine.connectControl(index, "group_" + channelGroup + "_enable", "PioneerDDJSXRevamp.fxAssignLeds", value);
                        if (value) {
                            engine.trigger(index, "group_" + channelGroup + "_enable");
                        }
                    }
                }
            }
            if (PioneerDDJSXRevamp.fxUnitGroups[index] >= 2) {
                for (channelGroup in PioneerDDJSXRevamp.channelGroups) {
                    if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(channelGroup)) {
                        engine.connectControl(index, "group_" + channelGroup + "_enable", "PioneerDDJSXRevamp.fxAssignLeds", !value);
                        if (value) {
                            engine.trigger(index, "group_" + channelGroup + "_enable");
                        } else {
                            PioneerDDJSXRevamp.fxAssignLedControl(index, PioneerDDJSXRevamp.channelGroups[channelGroup], false);
                        }
                    }
                }
            }
        }
    }
};


///////////////////////////////////////////////////////////////
//                          LED HELPERS                      //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.deckConverter = function(group) {
    if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(group)) {
        return PioneerDDJSXRevamp.channelGroups[group];
    }
    return group;
};

PioneerDDJSXRevamp.flashLedState = 0;

PioneerDDJSXRevamp.flashLed = function(deck, ledNumber) {
    if (PioneerDDJSXRevamp.flashLedState === 0) {
        PioneerDDJSXRevamp.nonPadLedControl(deck, ledNumber, 1);
        PioneerDDJSXRevamp.flashLedState = 1;
    } else if (PioneerDDJSXRevamp.flashLedState === 1) {
        PioneerDDJSXRevamp.nonPadLedControl(deck, ledNumber, 0);
        PioneerDDJSXRevamp.flashLedState = 0;
    }
};

PioneerDDJSXRevamp.resetNonDeckLeds = function() {
    var indexFxUnit;

    // fx Leds:
    for (indexFxUnit in PioneerDDJSXRevamp.fxUnitGroups) {
        if (PioneerDDJSXRevamp.fxUnitGroups.hasOwnProperty(indexFxUnit)) {
            if (PioneerDDJSXRevamp.fxUnitGroups[indexFxUnit] < 2) {
                for (var indexFxLed in PioneerDDJSXRevamp.fxEffectGroups) {
                    if (PioneerDDJSXRevamp.fxEffectGroups.hasOwnProperty(indexFxLed)) {
                        PioneerDDJSXRevamp.fxLedControl(
                            PioneerDDJSXRevamp.fxUnitGroups[indexFxUnit],
                            PioneerDDJSXRevamp.fxEffectGroups[indexFxLed],
                            false,
                            false
                        );
                        PioneerDDJSXRevamp.fxLedControl(
                            PioneerDDJSXRevamp.fxUnitGroups[indexFxUnit],
                            PioneerDDJSXRevamp.fxEffectGroups[indexFxLed],
                            true,
                            false
                        );
                    }
                }
                PioneerDDJSXRevamp.fxLedControl(PioneerDDJSXRevamp.fxUnitGroups[indexFxUnit], 0x03, false, false);
                PioneerDDJSXRevamp.fxLedControl(PioneerDDJSXRevamp.fxUnitGroups[indexFxUnit], 0x03, true, false);
            }
        }
    }

    // fx assign Leds:
    for (indexFxUnit in PioneerDDJSXRevamp.fxUnitGroups) {
        if (PioneerDDJSXRevamp.fxUnitGroups.hasOwnProperty(indexFxUnit)) {
            for (var channelGroup in PioneerDDJSXRevamp.channelGroups) {
                if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(channelGroup)) {
                    PioneerDDJSXRevamp.fxAssignLedControl(
                        indexFxUnit,
                        PioneerDDJSXRevamp.channelGroups[channelGroup],
                        false
                    );
                }
            }
        }
    }

    // general Leds:
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftMasterCue, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.loadDeck1, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftLoadDeck1, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.loadDeck2, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftLoadDeck2, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.loadDeck3, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftLoadDeck3, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.loadDeck4, false);
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftLoadDeck4, false);
};

PioneerDDJSXRevamp.fxAssignLedControl = function(unit, ledNumber, active) {
    var fxAssignLedsBaseChannel = 0x96,
        fxAssignLedsBaseControl = 0;

    if (unit === "[EffectRack1_EffectUnit1]") {
        fxAssignLedsBaseControl = PioneerDDJSXRevamp.nonPadLeds.fx1assignDeck1;
    }
    if (unit === "[EffectRack1_EffectUnit2]") {
        fxAssignLedsBaseControl = PioneerDDJSXRevamp.nonPadLeds.fx2assignDeck1;
    }
    if (unit === "[EffectRack1_EffectUnit3]") {
        fxAssignLedsBaseControl = PioneerDDJSXRevamp.nonPadLeds.shiftFx1assignDeck1;
    }
    if (unit === "[EffectRack1_EffectUnit4]") {
        fxAssignLedsBaseControl = PioneerDDJSXRevamp.nonPadLeds.shiftFx2assignDeck1;
    }

    midi.sendShortMsg(
        fxAssignLedsBaseChannel,
        fxAssignLedsBaseControl + ledNumber,
        active ? 0x7F : 0x00
    );
};

PioneerDDJSXRevamp.fxLedControl = function(unit, ledNumber, shift, active) {
    var fxLedsBaseChannel = 0x94,
        fxLedsBaseControl = (shift ? 0x63 : 0x47);

    midi.sendShortMsg(
        fxLedsBaseChannel + unit,
        fxLedsBaseControl + ledNumber,
        active ? 0x7F : 0x00
    );
};

PioneerDDJSXRevamp.padLedControl = function(deck, groupNumber, ledNumber, shift, active) {
    var padLedsBaseChannel = 0x97,
        padLedControl = (shift ? 0x08 : 0x00) + groupNumber + ledNumber,
        midiChannelOffset = PioneerDDJSXRevamp.deckConverter(deck);

    if (midiChannelOffset !== null) {
        midi.sendShortMsg(
            padLedsBaseChannel + midiChannelOffset,
            padLedControl,
            active ? 0x7F : 0x00
        );
    }
};

PioneerDDJSXRevamp.nonPadLedControl = function(deck, ledNumber, active) {
    var nonPadLedsBaseChannel = 0x90,
        midiChannelOffset = PioneerDDJSXRevamp.deckConverter(deck);

    if (midiChannelOffset !== null) {
        midi.sendShortMsg(
            nonPadLedsBaseChannel + midiChannelOffset,
            ledNumber,
            active ? 0x7F : 0x00
        );
    }
};

PioneerDDJSXRevamp.illuminateFunctionControl = function(ledNumber, active) {
    var illuminationBaseChannel = 0x9B;

    midi.sendShortMsg(
        illuminationBaseChannel,
        ledNumber,
        active ? 0x7F : 0x00
    );
};

PioneerDDJSXRevamp.wheelLedControl = function(deck, ledNumber) {
    var wheelLedBaseChannel = 0xBB,
        channel = PioneerDDJSXRevamp.deckConverter(deck);

    if (channel !== null) {
        midi.sendShortMsg(
            wheelLedBaseChannel,
            channel,
            ledNumber
        );
    }
};

PioneerDDJSXRevamp.generalLedControl = function(ledNumber, active) {
    var generalLedBaseChannel = 0x96;

    midi.sendShortMsg(
        generalLedBaseChannel,
        ledNumber,
        active ? 0x7F : 0x00
    );
};

PioneerDDJSXRevamp.updateParameterStatusLeds = function(group, statusRoll, statusLoop, statusSampler, statusSlicerQuant, statusSlicerDomain) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftRollMode, statusRoll & (1 << 1));
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightRollMode, statusRoll & 1);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftGroup2Mode, statusLoop & (1 << 1));
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightGroup2Mode, statusLoop & 1);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftSamplerMode, statusSampler & (1 << 1));
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightSamplerMode, statusSampler & 1);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftSlicerMode, statusSlicerQuant & (1 << 1));
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightSlicerMode, statusSlicerQuant & 1);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftParameterLeftSlicerMode, statusSlicerDomain & (1 << 1));
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftParameterRightSlicerMode, statusSlicerDomain & 1);
};


///////////////////////////////////////////////////////////////
//                             LEDS                          //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.fxAssignLeds = function(value, group, control) {
    var channelGroup = control.replace("group_", '').replace("_enable", '');
    PioneerDDJSXRevamp.fxAssignLedControl(group, PioneerDDJSXRevamp.channelGroups[channelGroup], value);
};

PioneerDDJSXRevamp.headphoneCueLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.headphoneCue, value);
};

PioneerDDJSXRevamp.shiftHeadphoneCueLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftHeadphoneCue, value);
};

PioneerDDJSXRevamp.shiftMasterCueLed = function(value, group, control) {
    PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds.shiftMasterCue, value);
};

PioneerDDJSXRevamp.keyLockLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.keyLock, value);
};

PioneerDDJSXRevamp.playLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.play, value);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftPlay, value);
};

PioneerDDJSXRevamp.wheelLeds = function(value, group, control) {
    // Timing calculation is handled in seconds!
    var deck = PioneerDDJSXRevamp.channelGroups[group],
        duration = engine.getValue(group, "duration"),
        elapsedTime = value * duration,
        remainingTime = duration - elapsedTime,
        revolutionsPerSecond = PioneerDDJSXRevamp.scratchSettings.vinylSpeed / 60,
        speed = parseInt(revolutionsPerSecond * PioneerDDJSXRevamp.wheelLedCircle.maxVal),
        wheelPos = PioneerDDJSXRevamp.wheelLedCircle.minVal;

    if (value >= 0) {
        wheelPos = PioneerDDJSXRevamp.wheelLedCircle.minVal + 0x01 + ((speed * elapsedTime) % PioneerDDJSXRevamp.wheelLedCircle.maxVal);
    } else {
        wheelPos = PioneerDDJSXRevamp.wheelLedCircle.maxVal + 0x01 + ((speed * elapsedTime) % PioneerDDJSXRevamp.wheelLedCircle.maxVal);
    }
    // let wheel LEDs blink if remaining time is less than 30s:
    if (remainingTime > 0 && remainingTime < 30 && !engine.isScratching(deck + 1)) {
        var blinkInterval = parseInt(remainingTime / 3); //increase blinking according time left
        if (blinkInterval < 3) {
            blinkInterval = 3;
        }
        if (PioneerDDJSXRevamp.wheelLedsBlinkStatus[deck] < blinkInterval) {
            wheelPos = PioneerDDJSXRevamp.wheelLedCircle.minVal;
        } else if (PioneerDDJSXRevamp.wheelLedsBlinkStatus[deck] > (blinkInterval - parseInt(6 / blinkInterval))) {
            PioneerDDJSXRevamp.wheelLedsBlinkStatus[deck] = 0;
        }
        PioneerDDJSXRevamp.wheelLedsBlinkStatus[deck]++;
    }
    wheelPos = parseInt(wheelPos);
    // Only send midi message when the position is actually updated.
    // Otherwise, the amount of messages may exceed the maximum rate at high position update rates.
    if (PioneerDDJSXRevamp.wheelLedsPosition[deck] !== wheelPos) {
        PioneerDDJSXRevamp.wheelLedControl(group, wheelPos);
    }
    PioneerDDJSXRevamp.wheelLedsPosition[deck] = wheelPos;
};

PioneerDDJSXRevamp.cueLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.cue, value);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftCue, value);
};

PioneerDDJSXRevamp.loadLed = function(value, group, control) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    if (value > 0) {
        PioneerDDJSXRevamp.wheelLedControl(group, PioneerDDJSXRevamp.wheelLedCircle.maxVal);
        PioneerDDJSXRevamp.generalLedControl(PioneerDDJSXRevamp.nonPadLeds["loadDeck" + (deck + 1)], true);
        PioneerDDJSXRevamp.illuminateFunctionControl(PioneerDDJSXRevamp.illuminationControl["loadedDeck" + (deck + 1)], true);
        engine.trigger(group, "playposition");
    } else {
        PioneerDDJSXRevamp.wheelLedControl(group, PioneerDDJSXRevamp.wheelLedCircle.minVal);
    }
};

PioneerDDJSXRevamp.reverseLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.censor, value);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftCensor, value);
};

PioneerDDJSXRevamp.slipLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.slip, value);
};

PioneerDDJSXRevamp.quantizeLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftSync, value);
};

PioneerDDJSXRevamp.syncLed = function(value, group, control) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    var rate = engine.getValue(group, "rate");
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.sync, value);
    if (value) {
        PioneerDDJSXRevamp.syncRate[deck] = rate;
        if (PioneerDDJSXRevamp.syncRate[deck] > 0) {
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverMinus, 1);
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverPlus, 0);
        } else if (PioneerDDJSXRevamp.syncRate[deck] < 0) {
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverMinus, 0);
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverPlus, 1);
        }
    }
    if (!value) {
        if (PioneerDDJSXRevamp.syncRate[deck] !== rate || rate === 0) {
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverPlus, 0);
            PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.takeoverMinus, 0);
            PioneerDDJSXRevamp.syncRate[deck] = 0;
        }
    }
};

PioneerDDJSXRevamp.autoLoopLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.autoLoop, value);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftLoopOut, value);
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftAutoLoop, value);
};

PioneerDDJSXRevamp.loopInLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.loopIn, value);
};

PioneerDDJSXRevamp.shiftLoopInLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftLoopIn, value);
};

PioneerDDJSXRevamp.loopOutLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.loopOut, value);
};

PioneerDDJSXRevamp.loopHalveLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.loopHalve, value);
};

PioneerDDJSXRevamp.loopDoubleLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.loopDouble, value);
};

PioneerDDJSXRevamp.loopShiftFWLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftLoopDouble, value);
};

PioneerDDJSXRevamp.loopShiftBKWLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.shiftLoopHalve, value);
};

PioneerDDJSXRevamp.hotCueParameterRightLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterRightHotCueMode, value);
};

PioneerDDJSXRevamp.hotCueParameterLeftLed = function(value, group, control) {
    PioneerDDJSXRevamp.nonPadLedControl(group, PioneerDDJSXRevamp.nonPadLeds.parameterLeftHotCueMode, value);
};

PioneerDDJSXRevamp.samplerLeds = function(value, group, control) {
    var samplerIndex = (group.replace("[Sampler", '').replace(']', '') - 1) % 8,
        sampleDeck = "[Sampler" + (samplerIndex + 1) + "]",
        padNum = PioneerDDJSXRevamp.samplerGroups[sampleDeck];

    for (var index in PioneerDDJSXRevamp.channelGroups) {
        if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(index)) {
            PioneerDDJSXRevamp.padLedControl(
                PioneerDDJSXRevamp.channelGroups[index],
                PioneerDDJSXRevamp.ledGroups.sampler,
                padNum,
                false,
                value
            );
        }
    }
};

PioneerDDJSXRevamp.samplerLedsPlay = function(value, group, control) {
    var samplerIndex = (group.replace("[Sampler", '').replace(']', '') - 1) % 8,
        sampleDeck = "[Sampler" + (samplerIndex + 1) + "]",
        padNum = PioneerDDJSXRevamp.samplerGroups[sampleDeck];

    if (!engine.getValue(sampleDeck, "duration")) {
        return;
    }

    for (var index in PioneerDDJSXRevamp.channelGroups) {
        if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(index)) {
            PioneerDDJSXRevamp.padLedControl(
                PioneerDDJSXRevamp.channelGroups[index],
                PioneerDDJSXRevamp.ledGroups.sampler,
                padNum,
                false, !value
            );
            PioneerDDJSXRevamp.padLedControl(
                PioneerDDJSXRevamp.channelGroups[index],
                PioneerDDJSXRevamp.ledGroups.sampler,
                padNum,
                true,
                value
            );
        }
    }
};

PioneerDDJSXRevamp.beatloopLeds = function(value, group, control) {
    var padNum,
        shifted = false,
        deck = PioneerDDJSXRevamp.channelGroups[group];

    for (var index in PioneerDDJSXRevamp.selectedLoopIntervals[deck]) {
        if (PioneerDDJSXRevamp.selectedLoopIntervals[deck].hasOwnProperty(index)) {
            if (control === "beatloop_" + PioneerDDJSXRevamp.selectedLoopIntervals[deck][index] + "_enabled") {
                padNum = index % 8;
                PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.group2, padNum, shifted, value);
            }
        }
    }
};

PioneerDDJSXRevamp.beatlooprollLeds = function(value, group, control) {
    var padNum,
        shifted = false,
        deck = PioneerDDJSXRevamp.channelGroups[group];

    for (var index in PioneerDDJSXRevamp.selectedLooprollIntervals[deck]) {
        if (PioneerDDJSXRevamp.selectedLooprollIntervals[deck].hasOwnProperty(index)) {
            if (control === "beatlooproll_" + PioneerDDJSXRevamp.selectedLooprollIntervals[deck][index] + "_activate") {
                padNum = index % 8;
                PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.loopRoll, padNum, shifted, value);
            }
        }
    }
};

PioneerDDJSXRevamp.hotCueLeds = function(value, group, control) {
    var padNum = null,
        hotCueNum;

    for (hotCueNum = 1; hotCueNum <= 8; hotCueNum++) {
        if (control === "hotcue_" + hotCueNum + "_enabled") {
            padNum = (hotCueNum - 1);
            PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.hotCue, padNum, false, value);
            PioneerDDJSXRevamp.padLedControl(group, PioneerDDJSXRevamp.ledGroups.hotCue, padNum, true, value);
        }
    }
};

PioneerDDJSXRevamp.VuMeterLeds = function(value, group, control) {
    // Remark: Only deck vu meters can be controlled! Master vu meter is handled by hardware!
    var midiBaseAdress = 0xB0,
        channel = 0x02,
        midiOut = 0x00;

    value = parseInt(value * 0x76); //full level indicator: 0x7F

    if (engine.getValue(group, "PeakIndicator")) {
        value = value + 0x09;
    }

    PioneerDDJSXRevamp.valueVuMeter[group + "_current"] = value;

    for (var index in PioneerDDJSXRevamp.channelGroups) {
        if (PioneerDDJSXRevamp.channelGroups.hasOwnProperty(index)) {
            midiOut = PioneerDDJSXRevamp.valueVuMeter[index + "_current"];
            if (PioneerDDJSXRevamp.twinkleVumeterAutodjOn) {
                if (engine.getValue("[AutoDJ]", "enabled")) {
                    if (PioneerDDJSXRevamp.valueVuMeter[index + "_enabled"]) {
                        midiOut = 0;
                    }
                    if (midiOut < 5 && !PioneerDDJSXRevamp.valueVuMeter[index + "_enabled"]) {
                        midiOut = 5;
                    }
                }
            }
            midi.sendShortMsg(
                midiBaseAdress + PioneerDDJSXRevamp.channelGroups[index],
                channel,
                midiOut
            );
        }
    }
};


///////////////////////////////////////////////////////////////
//                          JOGWHEELS                        //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.getJogWheelDelta = function(value) {
    // The Wheel control centers on 0x40; find out how much it's moved by.
    return value - 0x40;
};

PioneerDDJSXRevamp.pitchBendOrScratch = function(group, deck, delta) {
    var guestimatedJogWheelPlayingSpinRate = 1
        currentlyScratching = PioneerDDJSXRevamp.scratchMode[deck] && engine.isScratching(deck + 1);

    if (engine.isScratching(deck + 1) && Math.abs(delta) <= guestimatedJogWheelPlayingSpinRate && !PioneerDDJSXRevamp.jog_touched[deck]) {
        // FIXME reword, actually seems to add some smoothness on spinbacks as well.
        // This is a weird edge case which makes sense for spinbacks but not for
        // spinforwards. What happens is that if we do not disable the scratch
        // before the timer expires, the record will stop before resuming
        // playback. In the case of spinback the record goes from a negative
        // speed, stops, then resumes at a positive speed (which makes sense
        // since it reverses directions). However for a forward spin, it
        // wouldn't make sense for the record to go from high positive speed,
        // slowing down to a stop, then resuming speed; it should instead go
        // from a high positive speed, then slowing down until it reaches a
        // normal playback speed before continuing playback.
        engine.scratchTick(deck + 1, delta);
        PioneerDDJSXRevamp.disableScratchDisableTimer(deck)
        PioneerDDJSXRevamp.disableScratchForDeck(deck)
    } else if (PioneerDDJSXRevamp.scratchMode[deck] && engine.isScratching(deck + 1)) {
        engine.scratchTick(deck + 1, delta);
        if (!PioneerDDJSXRevamp.jog_touched[deck]) {
            // We only want to disable scratch mode if we have released the jog wheel.
            PioneerDDJSXRevamp.setOrResetScratchDisableTimer(deck)
        }
    } else {
        PioneerDDJSXRevamp.pitchBendFromJog(group, delta);
    }
}

PioneerDDJSXRevamp.setOrResetScratchDisableTimer = function(deck) {
    /* Why does this work?
      Basically, as long as the platter continues moving, on each tick, the
      timer will continue to be reset. Eventually the platter stops, we don't
      receive any more platter tick events, we don't reset the timer, in which
      case the timer will eventually execute and disable scratch mode

      The delay needs to be longer than the time between platter ticks.

      This interval can be adjusted, see the ddj-sx manual for details:
      https://docs.pioneerdj.com/Manuals/DDJ_SX_DRI1094_manual/?page=26 (I
      believe the default is 3 ms, but can be lengthened to a max of 13ms. I do
      not know about timing edge cases regarding controller<->mixxx
      communication)

      Credit for the timer stuff goes the mixtrack file contributors.
      */
    var delayInMs = 1
    if (PioneerDDJSXRevamp.scratch_timer[deck]) {
        // Disable the existing timer
        engine.stopTimer(PioneerDDJSXRevamp.scratch_timer[deck]);
    }
    PioneerDDJSXRevamp.scratch_timer[deck] = engine.beginTimer(delayInMs, "PioneerDDJSXRevamp.disableScratchForDeck(" + deck + ")", true);
}

PioneerDDJSXRevamp.disableScratchDisableTimer = function(deck) {
    if (PioneerDDJSXRevamp.scratch_timer[deck]) {
        // Disable the existing timer
        engine.stopTimer(PioneerDDJSXRevamp.scratch_timer[deck]);
    }
}

PioneerDDJSXRevamp.disableScratchForDeck = function(deck) {
    PioneerDDJSXRevamp.scratch_timer[deck] = null;
    engine.scratchDisable(deck + 1, true);
}

PioneerDDJSXRevamp.jogRingTick = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    PioneerDDJSXRevamp.pitchBendOrScratch(group, deck, PioneerDDJSXRevamp.getJogWheelDelta(value))
};

PioneerDDJSXRevamp.jogRingTickShift = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    var delta = PioneerDDJSXRevamp.getJogWheelDelta(value);
    PioneerDDJSXRevamp.pitchBendOrScratch(group, deck, delta * PioneerDDJSXRevamp.jogwheelShiftMultiplier)
};

PioneerDDJSXRevamp.jogPlatterTick = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group]
        delta = PioneerDDJSXRevamp.getJogWheelDelta(value);

    if (PioneerDDJSXRevamp.gridAdjustSelected[deck]) {
        if (delta > 0) {
            script.toggleControl(group, "beats_adjust_faster");
        }
        if (delta <= 0) {
            script.toggleControl(group, "beats_adjust_slower");
        }
        return;
    }
    if (PioneerDDJSXRevamp.gridSlideSelected[deck]) {
        if (delta > 0) {
            script.toggleControl(group, "beats_translate_later");
        }
        if (delta <= 0) {
            script.toggleControl(group, "beats_translate_earlier");
        }
        return;
    }
    PioneerDDJSXRevamp.pitchBendOrScratch(group, deck, delta)
};

PioneerDDJSXRevamp.jogPlatterTickShift = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group]
        delta = PioneerDDJSXRevamp.getJogWheelDelta(value);

    PioneerDDJSXRevamp.pitchBendOrScratch(group, deck, delta * PioneerDDJSXRevamp.jogwheelShiftMultiplier)
};

PioneerDDJSXRevamp.jogTouch = function(channel, control, value, status, group) {
    // value = 127 on touch event, and value = 0 on touch-release event
    var deck = PioneerDDJSXRevamp.channelGroups[group];

    if (PioneerDDJSXRevamp.scratchMode[deck]) {
        if (value) {
            PioneerDDJSXRevamp.jog_touched[deck] = true;
            PioneerDDJSXRevamp.disableScratchDisableTimer(deck)
            engine.scratchEnable(
                deck + 1,
                PioneerDDJSXRevamp.scratchSettings.jogResolution,
                PioneerDDJSXRevamp.scratchSettings.vinylSpeed,
                PioneerDDJSXRevamp.scratchSettings.alpha,
                PioneerDDJSXRevamp.scratchSettings.beta,
                true
            );
        } else {
            PioneerDDJSXRevamp.jog_touched[deck] = false;
            PioneerDDJSXRevamp.setOrResetScratchDisableTimer(deck)
        }
    }
};

PioneerDDJSXRevamp.toggleScratch = function(channel, control, value, status, group) {
    var deck = PioneerDDJSXRevamp.channelGroups[group];
    if (value) {
        PioneerDDJSXRevamp.scratchMode[deck] = !PioneerDDJSXRevamp.scratchMode[deck];
        PioneerDDJSXRevamp.triggerVinylLed(deck);
    }
};

PioneerDDJSXRevamp.triggerVinylLed = function(deck) {
    PioneerDDJSXRevamp.nonPadLedControl(deck, PioneerDDJSXRevamp.nonPadLeds.vinyl, PioneerDDJSXRevamp.scratchMode[deck]);
};

PioneerDDJSXRevamp.pitchBendFromJog = function(group, movement) {
    engine.setValue(group, "jog", movement / 5 * PioneerDDJSXRevamp.jogwheelSensitivity);
};


///////////////////////////////////////////////////////////////
//             ROTARY SELECTOR & NAVIGATION BUTTONS          //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.loadPrepareButton = function(channel, control, value, status) {
    if (PioneerDDJSXRevamp.rotarySelectorChanged === true) {
        if (value) {
            engine.setValue("[PreviewDeck1]", "LoadSelectedTrackAndPlay", true);
        } else {
            if (PioneerDDJSXRevamp.jumpPreviewEnabled) {
                engine.setValue("[PreviewDeck1]", "playposition", PioneerDDJSXRevamp.jumpPreviewPosition);
            }
            PioneerDDJSXRevamp.rotarySelectorChanged = false;
        }
    } else {
        if (value) {
            if (engine.getValue("[PreviewDeck1]", "stop")) {
                script.toggleControl("[PreviewDeck1]", "play");
            } else {
                script.toggleControl("[PreviewDeck1]", "stop");
            }
        }
    }
};

PioneerDDJSXRevamp.backButton = function(channel, control, value, status) {
    script.toggleControl("[Library]", "MoveFocusBackward");
};

PioneerDDJSXRevamp.shiftBackButton = function(channel, control, value, status) {
    if (value) {
        script.toggleControl("[Master]", "maximize_library");
    }
};

PioneerDDJSXRevamp.getRotaryDelta = function(value) {
    var delta = 0x40 - Math.abs(0x40 - value),
        isCounterClockwise = value > 0x40;

    if (isCounterClockwise) {
        delta *= -1;
    }
    return delta;
};

PioneerDDJSXRevamp.rotarySelector = function(channel, control, value, status) {
    var delta = PioneerDDJSXRevamp.getRotaryDelta(value);

    engine.setValue("[Library]", "MoveVertical", delta);
    PioneerDDJSXRevamp.rotarySelectorChanged = true;
};

PioneerDDJSXRevamp.rotarySelectorShifted = function(channel, control, value, status) {
    var delta = PioneerDDJSXRevamp.getRotaryDelta(value),
        f = (delta > 0 ? "SelectNextPlaylist" : "SelectPrevPlaylist");

    engine.setValue("[Library]", "MoveHorizontal", delta);
};

PioneerDDJSXRevamp.rotarySelectorClick = function(channel, control, value, status) {
    script.toggleControl("[Library]", "GoToItem");
};

PioneerDDJSXRevamp.rotarySelectorShiftedClick = function(channel, control, value, status) {
    if (PioneerDDJSXRevamp.autoDJAddTop) {
        script.toggleControl("[Library]", "AutoDjAddTop");
    } else {
        script.toggleControl("[Library]", "AutoDjAddBottom");
    }
};


///////////////////////////////////////////////////////////////
//                             FX                            //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.fxAssignButton = function(channel, control, value, status, group) {
    if (value) {
        if ((control >= 0x4C) && (control <= 0x4F)) {
            script.toggleControl("[EffectRack1_EffectUnit1]", "group_" + group + "_enable");
        } else if ((control >= 0x50) && (control <= 0x53)) {
            script.toggleControl("[EffectRack1_EffectUnit2]", "group_" + group + "_enable");
        } else if ((control >= 0x70) && (control <= 0x73) && PioneerDDJSXRevamp.shiftPanelSelectPressed) {
            script.toggleControl("[EffectRack1_EffectUnit3]", "group_" + group + "_enable");
        } else if ((control >= 0x54) && (control <= 0x57) && PioneerDDJSXRevamp.shiftPanelSelectPressed) {
            script.toggleControl("[EffectRack1_EffectUnit4]", "group_" + group + "_enable");
        }
    }
};


///////////////////////////////////////////////////////////////
//                          SLICER                           //
///////////////////////////////////////////////////////////////

PioneerDDJSXRevamp.slicerBeatActive = function(value, group, control) {
    // This slicer implementation will work for constant beatgrids only!
    var deck = PioneerDDJSXRevamp.channelGroups[group],
        bpm = engine.getValue(group, "bpm"),
        playposition = engine.getValue(group, "playposition"),
        duration = engine.getValue(group, "duration"),
        slicerPosInSection = 0,
        ledBeatState = true,
        domain = PioneerDDJSXRevamp.selectedSlicerDomain[deck];

    if (engine.getValue(group, "beat_closest") === engine.getValue(group, "beat_next")) {
        return;
    }

    PioneerDDJSXRevamp.slicerBeatsPassed[deck] = Math.round((playposition * duration) * (bpm / 60));
    slicerPosInSection = Math.floor((PioneerDDJSXRevamp.slicerBeatsPassed[deck] % domain) / (domain / 8));

    if (PioneerDDJSXRevamp.activePadMode[deck] === PioneerDDJSXRevamp.padModes.slicer) {
        if (PioneerDDJSXRevamp.activeSlicerMode[deck] === PioneerDDJSXRevamp.slicerModes.contSlice) {
            ledBeatState = true;
        }
        if (PioneerDDJSXRevamp.activeSlicerMode[deck] === PioneerDDJSXRevamp.slicerModes.loopSlice) {
            ledBeatState = false;
            if (((PioneerDDJSXRevamp.slicerBeatsPassed[deck] - 1) % domain) === (domain - 1) &&
                !PioneerDDJSXRevamp.slicerAlreadyJumped[deck] &&
                PioneerDDJSXRevamp.slicerPreviousBeatsPassed[deck] < PioneerDDJSXRevamp.slicerBeatsPassed[deck]) {
                engine.setValue(group, "beatjump", -domain);
                PioneerDDJSXRevamp.slicerAlreadyJumped[deck] = true;
            } else {
                PioneerDDJSXRevamp.slicerAlreadyJumped[deck] = false;
            }
        }
        // PAD Led control:
        for (var i = 0; i < 8; i++) {
            if (PioneerDDJSXRevamp.slicerActive[deck]) {
                if (PioneerDDJSXRevamp.slicerButton[deck] !== i) {
                    PioneerDDJSXRevamp.padLedControl(
                        group,
                        PioneerDDJSXRevamp.ledGroups.slicer,
                        i,
                        false,
                        (slicerPosInSection === i) ? ledBeatState : !ledBeatState
                    );
                }
            } else {
                PioneerDDJSXRevamp.padLedControl(
                    group,
                    PioneerDDJSXRevamp.ledGroups.slicer,
                    i,
                    false,
                    (slicerPosInSection === i) ? ledBeatState : !ledBeatState
                );
            }
        }
    } else {
        PioneerDDJSXRevamp.slicerAlreadyJumped[deck] = false;
        PioneerDDJSXRevamp.slicerPreviousBeatsPassed[deck] = 0;
        PioneerDDJSXRevamp.slicerActive[deck] = false;
    }
};
