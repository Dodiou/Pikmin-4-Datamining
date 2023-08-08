## How to find Radar map rotation

In the main level JSON, e.g. `Area001_P.json`, find the story mode object:
- `BP_CarrotGameRuleStory_C` is Day/Night/Olimar story
- `BP_CarrotGameRuleStoryCaveOtakaraCollect_C` is Challenge
- `BP_CarrotGameRuleStoryCaveExtra_C` is Sage Trials

This object should have a `NorthArrow` property. Read the `ObjectPath` to get the `ArrowComponent`.

The `RelativeRotation.Yaw` of the `ArrowComponent` contains the rotation in degrees anticlockwise to rotate the map for displaying.