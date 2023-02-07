# Social
## Usage
```javascript
import SocialComponentTitle from 'src/client/component_profile/title/social';

<SocialComponentTitle
  maintitle="收藏的文章"
  privacySettingSwitch={ this.props.profile.viewas === 'self' }
  privacyText="collectActivity"
  privacy={ this.props.privacy }
  advancenSetting
>
  { children } // 可以放socialSubtitle 或是自己客製
</SocialComponentTitle>
```
## Props
### maintitle : [String]
- must have

### privacySettingSwitch : [Boolean]
- option
- default false

### privacyText : [String]
- option
- 如果privacySetting是true 必須填updateSinglePrivacy相對應的詞

### privacy : [Number]
- option
- default 0
- 如果privacySetting是true 會依照privacy的值有不同的icon

### advancenSetting : [Boolean]
- option
- default false
- 如果privacySetting是true 此值設true會有多"隱私-朋友"設定

# SocialSubtitle
```javascript
import SocialSubtitle from 'src/client/component_profile/title/socialSubtitle';
<SocialSubtitle
  link={ `/profile/${this.props.params.pid}/activity?mode=collect` }
  gtm="收藏文章 - 總數"
  count={ this.state.collectCount }
  unit="篇"
/>
```
## Props
### link : [String]
### gtm : [String]
### count : [Number]
### unit : [String]
- must have
