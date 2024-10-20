# React BabylonJS 3D Çizim Uygulaması

Bu proje, React ve BabylonJS kullanılarak geliştirilmiş bir 3D çizim uygulamasıdır. Kullanıcılar dikdörtgenler, daireler ve çizgiler gibi 3D şekiller ekleyebilir, taşıyabilir, seçebilir ve silebilir. Aynı zamanda şekil verilerini JSON formatında dışa aktarabilir ve JSON dosyalarından şekil verilerini içe aktarabilir.

## Özellikler

- Rastgele renklerle Dikdörtgen, Daire ve Çizgi ekleme.
- Şekilleri 3D uzayda sürükleyip taşıma.
- Şekillere tıklayarak seçebilme.
- Bireysel şekilleri veya tüm şekilleri silebilme.
- Şekil verilerini JSON formatında dışa ve içe aktarma.
- BabylonJS motoru ile gerçek zamanlı 3D sahne render işlemi.

## Kullanılan Teknolojiler

- React: Kullanıcı arayüzleri geliştirmek için kullanılan JavaScript kütüphanesi.
- BabylonJS: 3D sahnelerin render edilmesi ve 3D nesnelerle etkileşim için güçlü bir 3D motoru.
- UUID: Her şekil için benzersiz kimlik oluşturmak amacıyla kullanılır.
- HTML5 File API: JSON dosyalarını içe ve dışa aktarmak için kullanılır.

### Installation

1. Clone the repository:

```bash git clone <repository-url> ```

2. Navigate to the project directory:

```bash cd react-babylonjs-3d-app```

3.Install dependencies: Ensure you have Node.js installed, then run:

```bash npm install ```

4.Start the development server:

```bash  npm start ```

5.Open your browser: The application will be available at http://localhost:3000.
 

### Kullanım

- Şekil Ekleme: Dikdörtgen, daire veya çizgi eklemek için ilgili düğmelere tıklayın.
- Şekil Taşıma: Şekilleri 3D canvas üzerinde sürükleyerek taşıyın.
- Şekil Seçimi: Bir şekle tıklayarak seçin.
- Şekil Silme: Seçili şekli silmek için "Seçili Şekli Sil" düğmesini veya tüm şekilleri silmek için "Tüm Şekilleri Sil" düğmesini kullanın.
- Şekil Dışa Aktarma: Tüm şekilleri JSON formatında kaydetmek için "JSON Dışa Aktar" düğmesine tıklayın.
- Şekil İçe Aktarma: JSON dosyasından şekilleri yüklemek için dosya girişini kullanın.

### Proje Yapısı

-  App.js: Şekil oluşturma, etkileşim, silme ve BabylonJS motorunu yöneten ana React bileşeni.
-  BabylonJS, 3D şekillerin render edilmesi ve sürükleme işlemleri için kullanılır.

### Klavye Kısayolları
- Delete: Deletes the selected shapes.

### Gelecek Geliştirmeler

- Şekil boyutlandırma yeteneği eklenebilir.
- Birden fazla şekli seçme ve birlikte yönetme desteği eklenebilir.
- Daha iyi şekil kontrolü için geri alma/yineleme işlevselliği uygulanabilir.   
