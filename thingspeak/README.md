# ThingSpeak Configuration Guide

This guide will help you set up ThingSpeak for data visualization as an alternative/complement to the web dashboard.

## What is ThingSpeak?

ThingSpeak is an IoT analytics platform that allows you to:

- Collect and store sensor data in the cloud
- Visualize data with customizable charts
- Analyze data with MATLAB
- Share data publicly or privately
- Set up automatic alerts and notifications

## Step 1: Create ThingSpeak Account

1. Go to https://thingspeak.com
2. Click **Get Started For Free**
3. Create account or sign in with MathWorks account
4. Verify email address

## Step 2: Create a New Channel

1. Click **Channels** → **My Channels**
2. Click **New Channel** button
3. Fill in channel details:

### Channel Settings

**Name**: `Water Quality Monitor`

**Description**: `Real-time water quality and flow monitoring system with leakage detection`

**Field Configuration**:

- **Field 1**: `TDS Value (ppm)`
- **Field 2**: `Flow Rate (L/min)`
- **Field 3**: `Expected Flow (L/min)`
- **Field 4**: `Total Volume (L)`

**Options**:

- ☑ Make channel public (if you want to share)
- ☐ Show channel location (optional)
- ☑ Show status

4. Click **Save Channel**

## Step 3: Get API Keys

### Write API Key (for NodeMCU)

1. Go to **API Keys** tab
2. Copy **Write API Key**
3. Save it for later (you'll need this in `secrets.h`)

Example: `ABCDEFGHIJKLMNOP`

### Read API Key (for visualization)

1. On same **API Keys** tab
2. Copy **Read API Key**
3. Save it (needed if you want to embed charts on other websites)

## Step 4: Configure Arduino Code

Update your `secrets.h` file:

```cpp
#define THINGSPEAK_API_KEY "YOUR_WRITE_API_KEY_HERE"
#define THINGSPEAK_CHANNEL_ID "YOUR_CHANNEL_ID"
```

The channel ID is visible in the URL or on the channel page.

## Step 5: Customize Chart Display

### Public View Settings

1. Go to **Private View** tab
2. Add widgets for each field:

#### TDS Value Chart

- **Widget Type**: Chart
- **Field**: Field 1
- **Options**:
  - Results: 100
  - Time scale: Auto
  - Y-axis: 0 to 1000

#### Flow Rate Gauge

- **Widget Type**: Gauge
- **Field**: Field 2
- **Min**: 0
- **Max**: 5
- **Warning**: 1.5
- **Danger**: 3

#### Numeric Display

- **Widget Type**: Numeric Display
- **Field**: Field 4 (Total Volume)

### Arranging Widgets

1. Drag and drop widgets to arrange layout
2. Resize widgets by dragging corners
3. Click **Save** after arranging

## Step 6: Set Up Alerts (Optional)

ThingSpeak can send alerts when values exceed thresholds.

1. Go to **Apps** → **ThingHTTP**
2. Click **New ThingHTTP**
3. Configure webhook to your notification service

### Example: Email Alert

1. **Name**: `Water Quality Alert`
2. **URL**: `http://api.mailgun.net/v3/YOUR_DOMAIN/messages`
3. **Method**: POST
4. **Body**:

```
to=your-email@example.com
&from=alert@water-monitor.com
&subject=Water Quality Alert
&text=TDS exceeded threshold
```

5. Create **React** app:
   - **Condition Type**: Numeric
   - **Test Frequency**: Every 15 minutes
   - **Condition**: Field 1 > 500 OR Field 1 < 50
   - **Action**: Run ThingHTTP
   - **Options**: Run at most once per hour

## Step 7: Verify Data Upload

1. Upload Arduino code to NodeMCU
2. Wait 15-20 seconds
3. Refresh ThingSpeak channel page
4. You should see:
   - Data points on charts
   - Latest values in numeric displays
   - Updated timestamps

## Viewing Your Data

### Private View

- Full access to all features
- Edit widgets and settings
- https://thingspeak.com/channels/YOUR_CHANNEL_ID

### Public View

- Read-only access
- Share this URL with others
- https://thingspeak.com/channels/YOUR_CHANNEL_ID/public

### Embedded Charts

You can embed charts on your own website:

```html
<iframe
  width="450"
  height="260"
  style="border: 1px solid #cccccc;"
  src="https://thingspeak.com/channels/YOUR_CHANNEL_ID/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"
>
</iframe>
```

## Data Analysis with MATLAB

ThingSpeak includes MATLAB Online for advanced analysis:

1. Go to **Apps** → **MATLAB Analysis**
2. Click **New**
3. Write MATLAB code to analyze your data

### Example: Calculate Daily Average

```matlab
% Read data from last 24 hours
data = thingSpeakRead(YOUR_CHANNEL_ID, 'Fields', 1, 'NumDays', 1);

% Calculate average
avgTDS = mean(data);

% Display result
disp(['Average TDS: ' num2str(avgTDS) ' ppm']);

% Write back to channel (optional)
thingSpeakWrite(YOUR_CHANNEL_ID, avgTDS, 'WriteKey', 'YOUR_WRITE_KEY');
```

## Visualization Options

### Chart Types Available

1. **Line Chart**: Best for continuous data over time
2. **Column Chart**: Good for discrete measurements
3. **Gauge**: Great for current values with thresholds
4. **Numeric Display**: Simple number display
5. **Map**: Show device location (if GPS enabled)

### Customization Options

- **Colors**: Change line/bar colors
- **Time Range**: Last hour, day, week, month, year
- **Averaging**: None, 10 minutes, 15 minutes, etc.
- **Y-axis**: Auto-scale or fixed range
- **Show/Hide**: Legend, grid, markers

## Troubleshooting

### Problem: No data appearing

**Solutions**:

1. Verify Write API Key is correct
2. Check NodeMCU serial monitor for HTTP response
3. Ensure WiFi is connected
4. Check field numbers match (1-4)
5. Verify ThingSpeak allows your IP (some networks blocked)

### Problem: Data updating slowly

**Solutions**:

1. ThingSpeak free tier has 15-second update limit
2. Check `sendInterval` in Arduino code (15000ms minimum)
3. Verify multiple devices aren't writing to same channel

### Problem: Charts not displaying correctly

**Solutions**:

1. Clear browser cache
2. Refresh page
3. Check if channel is public (if accessing public URL)
4. Verify field has data

### Problem: "403 Forbidden" error

**Solutions**:

1. Check Write API Key
2. Verify channel ID
3. Ensure not exceeding rate limits (4 updates/minute free tier)

## Rate Limits

### Free Account

- **Updates**: 3 million messages per year
- **Rate**: 4 updates per minute per channel
- **Channels**: Up to 4 channels
- **Data Retention**: 1 year

### Paid Licenses

- More channels
- Higher update rates
- Longer data retention
- Commercial use allowed

For this project, free account is sufficient.

## Best Practices

1. **Update Frequency**: 15-30 seconds is optimal
2. **Data Retention**: Download historical data periodically
3. **Public Sharing**: Only make public if comfortable sharing data
4. **API Keys**: Keep Write API Key secret, Read API Key can be public
5. **Field Names**: Use descriptive names for clarity

## Integration with Dashboard

You can use both Firebase dashboard AND ThingSpeak:

**Firebase Dashboard**:

- Real-time updates
- Custom UI
- Alert notifications
- User authentication

**ThingSpeak**:

- Historical analysis
- MATLAB analytics
- Public sharing
- Embedded charts

Both can coexist and provide different benefits.

## Mobile App Access

ThingSpeak has mobile apps:

- **iOS**: Download from App Store
- **Android**: Download from Google Play

Features:

- View real-time data
- Get notifications
- Check historical data
- Monitor multiple channels

## Exporting Data

### CSV Export

1. Go to **Data Export** tab
2. Select date range
3. Choose fields
4. Click **Export**

### JSON API

Access data programmatically:

```
https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds.json?api_key=YOUR_READ_KEY&results=100
```

## Advanced Features

### Channel Groups

Combine multiple channels in one view (requires paid license)

### Plugins

- Weather Station
- Particle
- Twitter
- More at https://thingspeak.com/plugins

### TimeControl

Schedule actions based on time of day

## Support Resources

- **Documentation**: https://www.mathworks.com/help/thingspeak/
- **Community**: https://www.mathworks.com/matlabcentral/
- **Tutorials**: https://www.mathworks.com/videos/series/thingspeak-tutorials.html

## Next Steps

1. Create ThingSpeak account
2. Set up channel with 4 fields
3. Copy Write API Key to `secrets.h`
4. Upload code to NodeMCU
5. Verify data appearing on ThingSpeak
6. Customize charts and gauges
7. Set up alerts (optional)

For Firebase setup, see main README.md
